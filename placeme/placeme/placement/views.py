from rest_framework import viewsets, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Company, Drive, Application, InterviewSchedule
from .serializers import (
    CompanySerializer, DriveSerializer,
    ApplicationListSerializer, ApplicationDetailSerializer,InterviewScheduleSerializer
)


class CompanyViewSet(viewsets.ModelViewSet):
    """ViewSet for Company model (Read-only)"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location', 'industry']


    @action(
    detail=False,
    methods=['get'],
    permission_classes=[IsAuthenticated]
)   
    
    def my_company(self, request):

     company = Company.objects.filter(
        recruiter=request.user
     ).first()

     if not company:
        return Response(
            {"detail": "Company not found"},
            status=404
        )

     serializer = self.get_serializer(company)

     return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        """List all companies"""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Get company details"""
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)
    
    def update(self, request, *args, **kwargs):

     company = self.get_object()
 
     serializer = self.get_serializer(
        company,
        data=request.data,
        partial=True
    )

     if not serializer.is_valid():

        print(
            "COMPANY UPDATE ERRORS:",
            serializer.errors
        )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

     serializer.save()

     return Response(serializer.data)


class DriveViewSet(viewsets.ModelViewSet):
    """ViewSet for Drive model (Read-only with custom filters)"""
    queryset = Drive.objects.select_related('company').all()
    serializer_class = DriveSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['is_active', 'company']
    search_fields = ['position', 'company__name']
    ordering_fields = ['deadline', 'created_at']
    ordering = ['-created_at']

 

    def update(
    self,
    request,
    *args,
    **kwargs
):
     kwargs['partial'] = True

     return super().update(
        request,
        *args,
        **kwargs
    )


    def perform_create(self, serializer):
        """
        Automatically assign drive
        to logged in recruiter's company
        """
        company = Company.objects.filter(
            recruiter=self.request.user
        ).first()

        if not company:
            raise serializers.ValidationError(
                {"detail": "No company linked to this recruiter."}
            )

        serializer.save(company=company)

    @action(
        detail=True,
        methods=['get'],
        permission_classes=[IsAuthenticated]
    )
    def check_application_status(self, request, pk=None):
        """
        Check if student has already applied
        """
        drive = self.get_object()
        student = request.user

        application = Application.objects.filter(
            drive=drive,
            student=student
        ).first()

        if application:
            return Response({
                'applied': True,
                'status': application.status,
                'application_id': application.id
            })

        return Response({'applied': False})


class ApplicationViewSet(viewsets.ModelViewSet):
    """ViewSet for Application model (Full CRUD)"""
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'drive']
    ordering_fields = ['applied_at']
    ordering = ['-applied_at']
    

    def update(
    self,
    request,
    *args,
    **kwargs
):
     kwargs['partial'] = True

     return super().update(
        request,
        *args,
        **kwargs
    )

    
    def get_queryset(self):
        company = Company.objects.filter(
            recruiter=self.request.user
        ).first()

        if company:
            return Application.objects.filter(
                drive__company=company
            ).select_related(
                'student',
                'drive',
                'drive__company'
            )

        return Application.objects.filter(
            student=self.request.user
        ).select_related(
            'drive',
            'drive__company'
        )

    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action in ['create', 'retrieve', 'update', 'partial_update']:
            return ApplicationDetailSerializer
        return ApplicationListSerializer

    def create(self, request, *args, **kwargs):
        """Create application (apply to drive)"""
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

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def upload_resume(self, request, pk=None):
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



class InterviewScheduleViewSet(
    viewsets.ModelViewSet
):
    queryset = InterviewSchedule.objects.all()
    serializer_class = InterviewScheduleSerializer
    permission_classes = [AllowAny]
