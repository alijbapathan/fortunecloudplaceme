from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Drive, Application
from .serializers import (
    CompanySerializer, DriveSerializer,
    ApplicationListSerializer, ApplicationDetailSerializer
)


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Company model (Read-only)"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location', 'industry']
    
    def list(self, request, *args, **kwargs):
        """List all companies"""
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Get company details"""
        return super().retrieve(request, *args, **kwargs)


class DriveViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Drive model (Read-only with custom filters)"""
    queryset = Drive.objects.select_related('company').all()
    serializer_class = DriveSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'company']
    search_fields = ['position', 'company__name']
    ordering_fields = ['deadline', 'created_at']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def check_application_status(self, request, pk=None):
        """Check if student has already applied"""
        drive = self.get_object()
        student = request.user
        application = Application.objects.filter(drive=drive, student=student).first()
        
        # Also check profile completion
        try:
            student_profile = student.student_profile
            student_profile.update_completion()
            profile_ready = student_profile.is_placement_ready()
            completion = student_profile.profile_completion
            missing = student_profile.get_missing_fields() if not profile_ready else []
        except:
            profile_ready = False
            completion = 0
            missing = ['Branch', 'CGPA', 'Skills', 'Headline', 'About', 'Resume']
        
        if application:
            return Response({
                'applied': True,
                'status': application.status,
                'application_id': application.id,
                'profile_ready': profile_ready,
                'profile_completion': completion,
                'missing_fields': missing
            })
        
        return Response({
            'applied': False,
            'profile_ready': profile_ready,
            'profile_completion': completion,
            'missing_fields': missing
        })


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for Application model (Full CRUD)"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'drive']
    ordering_fields = ['applied_at']
    ordering = ['-applied_at']

    def get_queryset(self):
        """Get applications for current student"""
        return Application.objects.filter(student=self.request.user).select_related('drive', 'drive__company')

    def get_serializer_class(self):
      """Use different serializers for different actions"""

      if self.action in ['create', 'retrieve', 'update', 'partial_update']:
        return ApplicationDetailSerializer

      return ApplicationListSerializer

    def create(self, request, *args, **kwargs):
        """Create application (apply to drive)"""
        
        # ========================================
        # VALIDATE PROFILE COMPLETION
        # ========================================
        
        try:
            student_profile = request.user.student_profile
        except:
            return Response(
                {
                    'error': 'Profile not found. Please complete your profile first.',
                    'profile_completion': 0,
                    'missing_fields': ['Branch', 'CGPA', 'Skills', 'Headline', 'About', 'Resume']
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Update completion percentage
        student_profile.update_completion()
        
        # Check if profile is ready
        if not student_profile.is_placement_ready():
            missing = student_profile.get_missing_fields()
            completion = student_profile.profile_completion
            
            return Response(
                {
                    'error': f'Profile is {completion}% complete. Complete your profile to apply for drives.',
                    'profile_completion': completion,
                    'required_completion': 70,
                    'missing_fields': missing,
                    'message': 'Please complete the following fields to apply: ' + ', '.join(missing)
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Proceed with application creation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        """Auto-assign student to current user"""
        serializer.save()   
        from notifications.models import Notification

        application = serializer.instance

        Notification.objects.create(
            user=self.request.user,
            title='Application Submitted',
            message=f'You applied for {application.drive.position} at {application.drive.company.name}',
            
        )

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def update_status(self, request, pk=None):
        """Update application status"""
        application = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = ['applied', 'rejected', 'shortlisted', 'selected']
        if new_status not in valid_statuses:
            return Response(
                {'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def check_profile_status(self, request):
        """Check if student profile is ready for placement applications"""
        
        try:
            student_profile = request.user.student_profile
            student_profile.update_completion()
            
            return Response({
                'profile_ready': student_profile.is_placement_ready(),
                'profile_completion': student_profile.profile_completion,
                'missing_fields': student_profile.get_missing_fields(),
                'required_completion': 70,
                'is_placement_ready': student_profile.is_placement_ready()
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Error checking profile status: {e}")
            return Response({
                'profile_ready': False,
                'profile_completion': 0,
                'missing_fields': ['Profile not found'],
                'required_completion': 70,
                'is_placement_ready': False,
                'error': str(e)
            }, status=status.HTTP_200_OK)
        """Upload/update resume for application"""
        application = self.get_object()
        resume_url = request.data.get('resume_url')
        
        if not resume_url:
            return Response(
                {'error': 'resume_url is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        application.resume_url = resume_url
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)
