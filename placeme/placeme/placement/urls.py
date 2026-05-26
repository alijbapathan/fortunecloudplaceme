from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlacementDriveViewSet, ApplicationViewSet,
    InterviewScheduleViewSet, InterviewExperienceViewSet
)

router = DefaultRouter()
router.register(r'drives', PlacementDriveViewSet)
router.register(r'applications', ApplicationViewSet)
router.register(r'interview-schedules', InterviewScheduleViewSet)
router.register(r'interview-experiences', InterviewExperienceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
