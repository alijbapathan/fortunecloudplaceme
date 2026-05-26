from rest_framework import serializers
from .models import (
    Course, Enrollment, MockTest, Question, QuestionOption, TestAttempt, StudentAnswer
)
from users.serializers import UserSerializer, StudentProfileSerializer

class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'instructor', 'category', 'duration_hours',
                  'capacity', 'start_date', 'end_date', 'is_active', 'created_at']
        read_only_fields = ['id', 'instructor', 'created_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_id', 'attendance_percentage',
                  'completed', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']


class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'option_text', 'order']
        read_only_fields = ['id']


class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'difficulty', 'explanation', 'marks', 'order', 'options']
        read_only_fields = ['id']


class QuestionDetailSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'question_text', 'difficulty', 'correct_answer', 'explanation', 
                  'marks', 'order', 'options']
        read_only_fields = ['id']


class MockTestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = MockTest
        fields = ['id', 'title', 'category', 'description', 'total_questions', 'duration_minutes',
                  'passing_score', 'created_by', 'is_active', 'created_at', 'questions']
        read_only_fields = ['id', 'created_by', 'created_at', 'questions']


class MockTestDetailSerializer(serializers.ModelSerializer):
    questions = QuestionDetailSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = MockTest
        fields = ['id', 'title', 'category', 'description', 'total_questions', 'duration_minutes',
                  'passing_score', 'created_by', 'is_active', 'created_at', 'questions']
        read_only_fields = ['id', 'created_by', 'created_at']


class StudentAnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)
    selected_option = QuestionOptionSerializer(read_only=True)

    class Meta:
        model = StudentAnswer
        fields = ['id', 'question', 'selected_option', 'is_correct', 'time_taken_seconds']
        read_only_fields = ['id', 'is_correct']


class TestAttemptSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    test = MockTestSerializer(read_only=True)
    answers = StudentAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = TestAttempt
        fields = ['id', 'student', 'test', 'score', 'total_marks', 'percentage',
                  'weak_areas', 'time_taken_seconds', 'started_at', 'completed_at', 'answers']
        read_only_fields = ['id', 'student', 'answers']


class TestAttemptCreateSerializer(serializers.ModelSerializer):
    test_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TestAttempt
        fields = ['id', 'test_id']
        read_only_fields = ['id']
