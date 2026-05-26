from rest_framework import serializers
from .models import Notification, StudentNotification
from users.serializers import UserSerializer, StudentProfileSerializer

class NotificationSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'title', 'description', 'notification_type', 'created_by',
                  'target_role', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']


class StudentNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)
    student = StudentProfileSerializer(read_only=True)

    class Meta:
        model = StudentNotification
        fields = ['id', 'student', 'notification', 'is_read', 'read_at', 'created_at']
        read_only_fields = ['id', 'student', 'read_at', 'created_at']
