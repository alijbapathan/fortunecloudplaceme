from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    Course,
    MockTest,
    Enrollment,
    TestAttempt
)

from .serializers import (
    CourseSerializer,
    MockTestSerializer,
    EnrollmentDetailSerializer,
    TestAttemptDetailSerializer
)

from placement.permissions import IsTPO

from .models import MockTest
from .serializers import MockTestSerializer

class TPOCourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated, IsTPO]


class TPOMockTestViewSet(viewsets.ModelViewSet):
    queryset = MockTest.objects.all()
    serializer_class = MockTestSerializer
    permission_classes = [IsAuthenticated, IsTPO]


class TPOEnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Enrollment.objects.select_related(
        'student',
        'course'
    )
    serializer_class = EnrollmentDetailSerializer
    permission_classes = [IsAuthenticated, IsTPO]


class TPOTestAttemptViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TestAttempt.objects.select_related(
        'student',
        'test'
    )
    serializer_class = TestAttemptDetailSerializer
    permission_classes = [IsAuthenticated, IsTPO]