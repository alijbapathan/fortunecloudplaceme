from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('tpo', 'TPO'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    phone = models.CharField(max_length=15, blank=True)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    branch = models.CharField(max_length=100, blank=True)
    cgpa = models.FloatField(default=0.0)
    skills = models.TextField(blank=True, help_text="Comma-separated skills")
    resume_pdf = models.FileField(upload_to='resumes/', blank=True, null=True)
    github_link = models.URLField(blank=True)
    linkedin_link = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    resume_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_profiles'
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.branch}"


class Company(models.Model):
    name = models.CharField(max_length=200, unique=True)
    email = models.EmailField()
    industry = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_companies')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'companies'
    
    def __str__(self):
        return self.name

