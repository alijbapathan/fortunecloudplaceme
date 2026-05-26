from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import (
    PlacementDrive, Application, InterviewSchedule, InterviewExperience
)
from .serializers import (
    PlacementDriveSerializer, ApplicationSerializer,
    InterviewScheduleSerializer, InterviewExperienceSerializer
)

class PlacementDriveViewSet(viewsets.ModelViewSet):
    queryset = PlacementDrive.objects.all()
    serializer_class = PlacementDriveSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        drives = PlacementDrive.objects.filter(status='upcoming', drive_date__gte=timezone.now())
        serializer = self.get_serializer(drives, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        drive = self.get_object()
        student = request.user.student_profile
        
        if Application.objects.filter(student=student, drive=drive).exists():
            return Response({"error": "Already applied"}, status=status.HTTP_400_BAD_REQUEST)
        
        application = Application.objects.create(student=student, drive=drive)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Application.objects.filter(student__user=user)
        return Application.objects.all()

    @action(detail=False, methods=['get'])
    def my_applications(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can view applications"}, status=status.HTTP_403_FORBIDDEN)
        
        applications = Application.objects.filter(student__user=request.user)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)


class InterviewScheduleViewSet(viewsets.ModelViewSet):
    queryset = InterviewSchedule.objects.all()
    serializer_class = InterviewScheduleSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def my_interviews(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can view interviews"}, status=status.HTTP_403_FORBIDDEN)
        
        interviews = InterviewSchedule.objects.filter(application__student__user=request.user)
        serializer = self.get_serializer(interviews, many=True)
        return Response(serializer.data)


class InterviewExperienceViewSet(viewsets.ModelViewSet):
    queryset = InterviewExperience.objects.all()
    serializer_class = InterviewExperienceSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def my_experiences(self, request):
        if request.user.role != 'student':
            return Response({"error": "Only students can view experiences"}, status=status.HTTP_403_FORBIDDEN)
        
        experiences = InterviewExperience.objects.filter(student__user=request.user)
        serializer = self.get_serializer(experiences, many=True)
        return Response(serializer.data)

