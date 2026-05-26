from django.db import models
from django.utils import timezone
from users.models import User, Company, StudentProfile

class PlacementDrive(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='placement_drives')
    role = models.CharField(max_length=100)
    package = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    eligibility_cgpa = models.FloatField(default=0.0)
    required_skills = models.TextField(help_text="Comma-separated skills")
    eligible_branches = models.CharField(max_length=500, help_text="Comma-separated branches")
    drive_date = models.DateTimeField()
    registration_deadline = models.DateTimeField()
    total_positions = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_drives')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'placement_drives'
        ordering = ['-drive_date']
    
    def __str__(self):
        return f"{self.company.name} - {self.role}"
    
    @property
    def applications_count(self):
        return self.applications.filter(status='applied').count()


class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('selected', 'Selected'),
    ]
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    drive = models.ForeignKey(PlacementDrive, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='applied')
    match_score = models.IntegerField(default=0, help_text="AI match score 0-100")
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'applications'
        unique_together = ['student', 'drive']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.drive.role} @ {self.drive.company.name}"


class InterviewSchedule(models.Model):
    ROUND_CHOICES = [
        ('aptitude', 'Aptitude'),
        ('technical', 'Technical'),
        ('hr', 'HR'),
        ('group_discussion', 'Group Discussion'),
    ]
    
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interview_schedules')
    round_type = models.CharField(max_length=30, choices=ROUND_CHOICES)
    scheduled_date = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True, help_text="Online or physical location")
    result = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('pass', 'Pass'), ('fail', 'Fail')], default='pending')
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'interview_schedules'
        ordering = ['scheduled_date']
    
    def __str__(self):
        return f"{self.application.student.user.username} - {self.round_type}"


class InterviewExperience(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='interview_experiences')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='interview_experiences')
    role = models.CharField(max_length=100)
    rounds_description = models.TextField(help_text="Description of interview rounds")
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    questions_asked = models.TextField(blank=True, help_text="Questions asked in interview")
    tips = models.TextField(blank=True, help_text="Tips for future candidates")
    result = models.CharField(max_length=20, choices=[('selected', 'Selected'), ('rejected', 'Rejected')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'interview_experiences'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.company.name}"

