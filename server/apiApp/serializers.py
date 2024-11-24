from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now  # For validating dates
from .models import JobApplication, Job, Category
from .models import Profile
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__' 

# Serializer for JobApplication Model
class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'  # Use specific fields if more control is needed


# Serializer for User Registration
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'user_type']

    def create(self, validated_data):
        # Hash the password before creating the user
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create_user(**validated_data)  # Use create_user for built-in user creation logic
        return user


# Serializer for Job Model
class JobSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  # Allow linking category by ID
    category_details = serializers.SerializerMethodField()  # For nested category details
    created_at = serializers.DateTimeField(read_only=True)  # Read-only fields
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'description',
            'requirements',
            'location',
            'application_deadline',
            'category',
            'category_details',
            'employer',
            'created_at',
            'updated_at',
        ]

    def get_category_details(self, obj):
        """Returns nested details of the category."""
        if obj.category:
            return {
                'id': obj.category.id,
                'name': obj.category.name,
                'description': obj.category.description,
            }
        return None

    def validate_application_deadline(self, value):
        """Ensure the application deadline is not in the past."""
        if value < now():
            raise serializers.ValidationError("The application deadline cannot be in the past.")
        return value


# Serializer for Category Model
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
