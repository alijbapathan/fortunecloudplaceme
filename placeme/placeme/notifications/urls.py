from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet, StudentNotificationViewSet

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet)
router.register(r'student-notifications', StudentNotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
