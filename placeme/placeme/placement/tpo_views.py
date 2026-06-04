# placement/tpo_views.py

from rest_framework import viewsets
from .models import Company
from .serializers import CompanySerializer
from .permissions import IsTPO
from rest_framework.permissions import IsAuthenticated
from .models import Company, Drive, Application
from .serializers import (
    CompanySerializer,
    DriveSerializer,
    ApplicationDetailSerializer
)

from rest_framework.response import Response
from rest_framework.decorators import action

class TPOCompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsTPO]
    
class TPODriveViewSet(viewsets.ModelViewSet):
    queryset = Drive.objects.all()
    serializer_class = DriveSerializer
    permission_classes = [IsAuthenticated, IsTPO]
    
class TPOApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Application.objects.select_related(
        'student',
        'drive',
        'drive__company'
    )
    serializer_class = ApplicationDetailSerializer
    permission_classes = [IsAuthenticated, IsTPO]
    
class TPODashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsTPO]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        return Response({
            "companies": Company.objects.count(),
            "drives": Drive.objects.count(),
            "applications": Application.objects.count(),
            "selected": Application.objects.filter(
                status="selected"
            ).count()
        })