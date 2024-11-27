from django.contrib import admin

from .models import Category
from .models import Job, JobApplication, Profile


admin.site.register(Category)
admin.site.register(Job)
admin.site.register(JobApplication)
admin.site.register(Profile)
# Register your models here.
