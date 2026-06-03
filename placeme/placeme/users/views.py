from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer

class UserViewSet(viewsets.ModelViewSet):
    # queryset = User.objects.all()
    def get_queryset(self):  #rr Override get_queryset to return different results based on user role
        user = self.request.user

    # TPO can see all users
        if user.role == "tpo":
            return User.objects.all()

    # students can only see themselves
        return User.objects.filter(id=user.id)
    
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User registered successfully", "user": UserSerializer(user).data},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def debug(self, request):
        """Debug endpoint to check user role and permissions"""
        return Response({
            'user_id': request.user.id,
            'username': request.user.username,
            'role': request.user.role,
            'is_authenticated': request.user.is_authenticated,
        })

