from django.db import models
from users.models import User, StudentProfile

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('drive_announce', 'Drive Announcement'),
        ('shortlist', 'Shortlist Notification'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('course_started', 'Course Started'),
        ('general', 'General Announcement'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_notifications')
    target_role = models.CharField(max_length=50, choices=[
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
        ('tpo', 'TPO'),
        ('all', 'All'),
    ])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class StudentNotification(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'student_notifications'
        ordering = ['-created_at']
        unique_together = ['student', 'notification']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.notification.title}"

