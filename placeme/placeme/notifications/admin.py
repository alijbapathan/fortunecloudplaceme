from django.contrib import admin
from .models import Notification, StudentNotification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'notification_type', 'target_role', 'is_active', 'created_at']
    list_filter = ['notification_type', 'target_role', 'is_active']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at']

@admin.register(StudentNotification)
class StudentNotificationAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'notification', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['student__user__username', 'notification__title']
    readonly_fields = ['created_at']
    
    def get_student_name(self, obj):
        return obj.student.user.username
    get_student_name.short_description = 'Student'

