from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.db.models import Avg
from .models import (
    Course, Enrollment, MockTest, Question, QuestionOption, TestAttempt, StudentAnswer
)
from .serializers import (
    CourseSerializer, EnrollmentSerializer, MockTestSerializer, 
    MockTestDetailSerializer, TestAttemptSerializer, TestAttemptCreateSerializer
)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        course = self.get_object()
        student = request.user.student_profile
        
        if Enrollment.objects.filter(student=student, course=course).exists():
            return Response({"error": "Already enrolled"}, status=status.HTTP_400_BAD_REQUEST)
        
        enrollment = Enrollment.objects.create(student=student, course=course)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Enrollment.objects.filter(student__user=user)
        return Enrollment.objects.all()

    @action(detail=False, methods=['get'])
    def my_enrollments(self, request):
        enrollments = Enrollment.objects.filter(student__user=request.user)
        serializer = self.get_serializer(enrollments, many=True)
        return Response(serializer.data)


class MockTestViewSet(viewsets.ModelViewSet):
    queryset = MockTest.objects.all()
    serializer_class = MockTestSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MockTestDetailSerializer
        return MockTestSerializer

    @action(detail=True, methods=['post'])
    def start_test(self, request, pk=None):
        test = self.get_object()
        student = request.user.student_profile
        
        attempt = TestAttempt.objects.create(
            student=student,
            test=test,
            score=0,
            total_marks=test.total_questions,
            percentage=0,
            time_taken_seconds=0,
            started_at=timezone.now(),
            completed_at=timezone.now()
        )
        serializer = TestAttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category')
        if category:
            tests = MockTest.objects.filter(category=category, is_active=True)
        else:
            tests = MockTest.objects.filter(is_active=True)
        serializer = self.get_serializer(tests, many=True)
        return Response(serializer.data)


class TestAttemptViewSet(viewsets.ModelViewSet):
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return TestAttempt.objects.filter(student__user=user)
        return TestAttempt.objects.all()

    @action(detail=False, methods=['get'])
    def my_attempts(self, request):
        attempts = TestAttempt.objects.filter(student__user=request.user)
        serializer = self.get_serializer(attempts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        student = request.user.student_profile
        attempts = TestAttempt.objects.filter(student=student)
        
        total_tests = attempts.count()
        avg_score = attempts.aggregate(Avg('percentage'))['percentage__avg'] or 0
        
        return Response({
            'total_tests': total_tests,
            'average_score': round(avg_score, 2)
        })


