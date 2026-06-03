from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, EnrollmentViewSet, MockTestViewSet, TestAttemptViewSet

from .tpo_views import (
    TPOCourseViewSet,
    TPOMockTestViewSet,
    TPOEnrollmentViewSet,
    TPOTestAttemptViewSet
) #rr Import TPO viewsets

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'tests', MockTestViewSet, basename='mock-test')
router.register(r'attempts', TestAttemptViewSet, basename='test-attempt')
from .tpo_views import TPOMockTestViewSet

router.register( #rr Register TPO viewsets with custom prefixes
    r'tpo/courses',
    TPOCourseViewSet,
    basename='tpo-course'
)

router.register(
    r'tpo/tests',
    TPOMockTestViewSet,
    basename='tpo-test'
)

router.register(
    r'tpo/enrollments',
    TPOEnrollmentViewSet,
    basename='tpo-enrollment'
)

router.register(
    r'tpo/attempts',
    TPOTestAttemptViewSet,
    basename='tpo-attempt'
)

router.register(
    r'tpo/courses',
    TPOCourseViewSet,
    basename='tpo-course'
)

router.register(
    r'tpo/mock-tests',
    TPOMockTestViewSet,
    basename='tpo-mock-tests'
)

urlpatterns = [
    path('', include(router.urls)),
]
