from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now
from .models import Job, Category, JobApplication, Profile
from .serializers import JobSerializer, CategorySerializer, JobApplicationSerializer, ProfileSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_jobs_by_category(request):
    category_name = request.query_params.get('category', None)
    if category_name:
        category = Category.objects.filter(name=category_name).first()
        if category:
            jobs = Job.objects.filter(category=category)
            serializer = JobSerializer(jobs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({'error': 'Category query parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)


# Create a Job (for Employers)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_job(request):
    user = request.user
    print(user)
    if user.profile.user_type != 'employer':  # Ensure only employers can create jobs
        return Response({'error': 'You are not authorized to post jobs.'}, status=403)

    data = request.data
    category = Category.objects.filter(id=data.get('category_id')).first()
    if not category:
        return Response({'error': 'Invalid category ID.'}, status=status.HTTP_400_BAD_REQUEST)

    job = Job.objects.create(
        title=data['title'],
        description=data['description'],
        requirements=data.get('requirements', ''),
        location=data['location'],
        application_deadline=data.get('application_deadline', now()),
        employer=user,
        category=category
    )

    serializer = JobSerializer(job)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# Job ViewSet for CRUD operations and filtering
class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        filters = self.request.query_params

        if 'category' in filters:
            category = Category.objects.filter(name=filters['category']).first()
            if category:
                queryset = queryset.filter(category=category)

        if 'location' in filters:
            queryset = queryset.filter(location__icontains=filters['location'])

        if 'status' in filters:
            queryset = queryset.filter(status=filters['status'])

        if 'employer_id' in filters:
            queryset = queryset.filter(employer_id=filters['employer_id'])

        return queryset


# Apply for a Job
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_job(request, job_id):
    user = request.user
    if user.profile.user_type != 'job_seeker':
        return Response({'error': 'Only job seekers can apply for jobs.'}, status=403)

    job = Job.objects.filter(id=job_id, status='open').first()
    if not job:
        return Response({'error': 'Job not found or is no longer open.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    application = JobApplication.objects.create(
        job=job,
        applicant=user,
        cover_letter=data.get('cover_letter', ''),
        resume=data.get('resume', None)
    )

    serializer = JobApplicationSerializer(application)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# Category Management (Get, Create)
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def manage_categories(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        print(request.user)
        if not request.user:  # Only admins or staff can create categories
            return Response({'error': 'You are not authorized to create categories.'}, status=403)

        data = request.data
        category = Category.objects.create(
            name=data['name'],
            description=data.get('description', '')
        )
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Profile Management
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    if request.method == 'GET':
        profile = Profile.objects.filter(user=request.user).first()
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'PUT':
        data = request.data
        profile = Profile.objects.filter(user=request.user).first()
        if not profile:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        profile.contact_number = data.get('contact_number', profile.contact_number)
        profile.skills = data.get('skills', profile.skills)
        profile.company_name = data.get('company_name', profile.company_name)
        profile.save()

        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)


# User Registration
@api_view(['POST'])
def register_view(request):
    print(request.data)  # Debugging: Check the incoming request data

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    user_type = request.data.get('user_type')

    if not username or not email or not password or not user_type:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if user_type not in ['employer', 'job_seeker']:
        return Response({'error': 'Invalid user type.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create(
        username=username,
        email=email,
        password=make_password(password)
    )

    # Create Profile
    Profile.objects.create(user=user, user_type=user_type)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,    
            'user_type': user.profile.user_type,
        },
    }, status=status.HTTP_201_CREATED)



# User Login
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.profile.user_type,
            },
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)
