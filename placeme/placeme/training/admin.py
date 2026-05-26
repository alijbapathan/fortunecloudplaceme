from django.contrib import admin
from .models import Course, Enrollment, MockTest, Question, QuestionOption, TestAttempt, StudentAnswer

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'instructor', 'start_date', 'is_active']
    list_filter = ['category', 'is_active', 'start_date']
    search_fields = ['title', 'instructor__username']
    readonly_fields = ['created_at']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'course', 'attendance_percentage', 'completed']
    list_filter = ['completed', 'created_at']
    search_fields = ['student__user__username', 'course__title']
    readonly_fields = ['created_at']
    
    def get_student_name(self, obj):
        return obj.student.user.username
    get_student_name.short_description = 'Student'

@admin.register(MockTest)
class MockTestAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'total_questions', 'duration_minutes', 'is_active']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title']
    readonly_fields = ['created_at']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['get_question_preview', 'test', 'difficulty', 'marks', 'order']
    list_filter = ['difficulty', 'test']
    search_fields = ['question_text', 'test__title']
    
    def get_question_preview(self, obj):
        return obj.question_text[:50] + '...' if len(obj.question_text) > 50 else obj.question_text
    get_question_preview.short_description = 'Question'

@admin.register(QuestionOption)
class QuestionOptionAdmin(admin.ModelAdmin):
    list_display = ['option_text', 'question', 'is_correct', 'order']
    list_filter = ['is_correct']
    search_fields = ['option_text', 'question__question_text']

@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'test', 'percentage', 'passed', 'completed_at']
    list_filter = ['completed_at', 'percentage']
    search_fields = ['student__user__username', 'test__title']
    readonly_fields = ['started_at', 'completed_at']
    
    def get_student_name(self, obj):
        return obj.student.user.username
    get_student_name.short_description = 'Student'
    
    def passed(self, obj):
        return obj.passed
    passed.boolean = True

@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ['get_student_name', 'get_question_preview', 'is_correct']
    list_filter = ['is_correct']
    search_fields = ['attempt__student__user__username']
    
    def get_student_name(self, obj):
        return obj.attempt.student.user.username
    get_student_name.short_description = 'Student'
    
    def get_question_preview(self, obj):
        preview = obj.question.question_text[:40]
        return preview + '...' if len(obj.question.question_text) > 40 else preview
    get_question_preview.short_description = 'Question'

