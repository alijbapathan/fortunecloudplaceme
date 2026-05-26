from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Notification, StudentNotification
from .serializers import NotificationSerializer, StudentNotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def active(self, request):
        notifications = Notification.objects.filter(is_active=True)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)


class StudentNotificationViewSet(viewsets.ModelViewSet):
    queryset = StudentNotification.objects.all()
    serializer_class = StudentNotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return StudentNotification.objects.filter(student__user=user)
        return StudentNotification.objects.all()

    @action(detail=False, methods=['get'])
    def my_notifications(self, request):
        notifications = StudentNotification.objects.filter(student__user=request.user)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        notifications = StudentNotification.objects.filter(
            student__user=request.user,
            is_read=False
        )
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.read_at = timezone.now()
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)


