from django.contrib import admin
from .models import PlacementDrive, Application, InterviewSchedule, InterviewExperience

@admin.register(PlacementDrive)
class PlacementDriveAdmin(admin.ModelAdmin):
    list_display = ['role', 'company', 'package', 'status', 'drive_date']
    list_filter = ['status', 'drive_date', 'company']
    search_fields = ['role', 'company__name']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'get_company_name', 'status', 'match_score']
    list_filter = ['status', 'applied_at']
    search_fields = ['student__user__username', 'drive__company__name']
    readonly_fields = ['applied_at', 'updated_at']
    
    def get_student_name(self, obj):
        return obj.student.user.username
    get_student_name.short_description = 'Student'
    
    def get_company_name(self, obj):
        return obj.drive.company.name
    get_company_name.short_description = 'Company'

@admin.register(InterviewSchedule)
class InterviewScheduleAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'round_type', 'scheduled_date', 'result']
    list_filter = ['round_type', 'result', 'scheduled_date']
    search_fields = ['application__student__user__username']
    readonly_fields = ['created_at']
    
    def get_student_name(self, obj):
        return obj.application.student.user.username
    get_student_name.short_description = 'Student'

@admin.register(InterviewExperience)
class InterviewExperienceAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'company', 'role', 'difficulty', 'result']
    list_filter = ['difficulty', 'result', 'company']
    search_fields = ['student__user__username', 'company__name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_student_name(self, obj):
        return obj.student.user.username
    get_student_name.short_description = 'Student'

