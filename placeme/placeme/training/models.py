from django.db import models
from users.models import User, StudentProfile

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    instructor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='courses_created')
    category = models.CharField(max_length=100, choices=[
        ('aptitude', 'Aptitude'),
        ('technical', 'Technical'),
        ('soft_skills', 'Soft Skills'),
        ('other', 'Other'),
    ])
    duration_hours = models.IntegerField()
    capacity = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'courses'
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title


class Enrollment(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    attendance_percentage = models.FloatField(default=0.0)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'course']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.course.title}"


class MockTest(models.Model):
    CATEGORY_CHOICES = [
        ('quant', 'Quantitative Aptitude'),
        ('verbal', 'Verbal Ability'),
        ('logical', 'Logical Reasoning'),
        ('technical', 'Technical'),
        ('coding', 'Coding'),
    ]
    
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    total_questions = models.IntegerField()
    duration_minutes = models.IntegerField()
    passing_score = models.IntegerField(default=40)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='tests_created')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'mock_tests'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    correct_answer = models.CharField(max_length=500)
    explanation = models.TextField(blank=True)
    marks = models.IntegerField(default=1)
    order = models.IntegerField()
    
    class Meta:
        db_table = 'questions'
        ordering = ['test', 'order']
        unique_together = ['test', 'order']
    
    def __str__(self):
        return f"{self.test.title} - Q{self.order}"


class QuestionOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField()
    
    class Meta:
        db_table = 'question_options'
        ordering = ['question', 'order']
    
    def __str__(self):
        return f"{self.question.test.title} - Option {self.order}"


class TestAttempt(models.Model):
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='test_attempts')
    test = models.ForeignKey(MockTest, on_delete=models.CASCADE, related_name='attempts')
    score = models.IntegerField()
    total_marks = models.IntegerField()
    percentage = models.FloatField()
    weak_areas = models.TextField(blank=True, help_text="JSON data of weak areas")
    time_taken_seconds = models.IntegerField()
    started_at = models.DateTimeField()
    completed_at = models.DateTimeField()
    
    class Meta:
        db_table = 'test_attempts'
        ordering = ['-completed_at']
    
    def __str__(self):
        return f"{self.student.user.username} - {self.test.title} - {self.percentage}%"
    
    @property
    def passed(self):
        return self.percentage >= self.test.passing_score


class StudentAnswer(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False)
    time_taken_seconds = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'student_answers'
        unique_together = ['attempt', 'question']
    
    def __str__(self):
        return f"{self.attempt.student.user.username} - Q{self.question.order}"

