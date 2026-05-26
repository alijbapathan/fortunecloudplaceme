from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CourseViewSet, EnrollmentViewSet, MockTestViewSet, TestAttemptViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'mock-tests', MockTestViewSet)
router.register(r'test-attempts', TestAttemptViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
