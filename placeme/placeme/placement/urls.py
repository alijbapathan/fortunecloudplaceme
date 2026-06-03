from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, DriveViewSet, ApplicationViewSet

from .tpo_views import (
    TPOCompanyViewSet,
    TPODriveViewSet,
    TPOApplicationViewSet,
    TPODashboardViewSet
)#rr Import TPOCompanyViewSet to include in router, but keep it separate from regular CompanyViewSet to avoid circular imports

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'drives', DriveViewSet, basename='drive')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(
    r'tpo/companies',
    TPOCompanyViewSet,
    basename='tpo-company'
)

router.register(
    r'tpo/drives',
    TPODriveViewSet,
    basename='tpo-drive'
)

router.register(
    r'tpo/applications',
    TPOApplicationViewSet,
    basename='tpo-application'
)

router.register(
    r'tpo/dashboard',
    TPODashboardViewSet,
    basename='tpo-dashboard'
)#rr Separate endpoint for TPOs to manage companies

urlpatterns = [
    path('', include(router.urls)),
]
