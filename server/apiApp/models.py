from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# User Profile Model
class Profile(models.Model):
    USER_TYPE_CHOICES = (
        ('employer', 'Employer'),
        ('job_seeker', 'Job Seeker'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  # Relevant for job seekers
    company_name = models.CharField(max_length=100, blank=True, null=True)  # Relevant for employers

    def __str__(self):
        return f"{self.user.username} - {self.user_type}"

# Job Categories
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

# Job Model
class Job(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('closed', 'Closed'),
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100)
    application_deadline = models.DateField(default=timezone.now)  # Corrected default
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)  # Job category
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# Job Application Model
class JobApplication(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    cover_letter = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)  # Optional resume upload
    application_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=(
            ('applied', 'Applied'),
            ('shortlisted', 'Shortlisted'),
            ('rejected', 'Rejected'),
            ('hired', 'Hired'),
        ),
        default='applied',
    )

    def __str__(self):
        return f"{self.applicant.username} -> {self.job.title}"
