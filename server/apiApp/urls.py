from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    JobViewSet,
    register_view,
    login_view,
    manage_categories,
    get_jobs_by_category,  # Assuming you have this view defined in views.py
    create_job,  # For creating jobs
    apply_for_job,  # For applying for jobs
    profile_view  # For profile view and update
)

# Create a router and register the JobViewSet
router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')

urlpatterns = [
    # Include all the routes generated by the router
    path('', include(router.urls)),

    # Custom JWT login endpoint for obtaining tokens
    path('auth/login/', login_view, name='login'),

    # Register endpoint for new user registration
    path('auth/register/', register_view, name='register'),

    # Endpoint to fetch all categories
    path('api/categories/', manage_categories, name='manage_categories'),

    # Endpoint to fetch jobs by category (requires a query parameter)
    path('api/jobs/', get_jobs_by_category, name='get_jobs_by_category'),

    # Endpoint for creating a new job (only accessible by employers)
    path('api/jobs/create/', create_job, name='create_job'),

    # Endpoint for applying to a job (requires job ID as part of the URL)
    path('api/jobs/<int:job_id>/apply/', apply_for_job, name='apply_for_job'),

    # Profile view and update endpoint
    path('api/profile/', profile_view, name='profile_view'),    
]
