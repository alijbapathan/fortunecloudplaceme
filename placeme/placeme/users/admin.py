from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, Company

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'first_name', 'last_name']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('PlaceMe', {'fields': ('role', 'phone')}),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'branch', 'cgpa', 'resume_score']
    list_filter = ['branch', 'cgpa']
    search_fields = ['user__first_name', 'user__last_name', 'user__username']
    
    def get_student_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_student_name.short_description = 'Student Name'

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'industry', 'verified']
    list_filter = ['verified', 'industry']
    search_fields = ['name', 'email']

