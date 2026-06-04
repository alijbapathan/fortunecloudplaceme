from rest_framework import (
    viewsets,
    status
)

from rest_framework.decorators import (
    action
)

from rest_framework.response import (
    Response
)

from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)

from .models import (
    User,
    Resume
)

from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    ResumeSerializer,
    ChangePasswordSerializer
)


# ============================================
# USER VIEWSET
# ============================================

class UserViewSet(
    viewsets.ModelViewSet
):

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        IsAuthenticated
    ]

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[
            AllowAny
        ]
    )
    def register(self, request):
        serializer = UserRegistrationSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(
        detail=False,
        methods=[
            'get',
            'put',
            'patch'
        ],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def me(self, request):

        if request.method == 'GET':
            serializer = UserSerializer(request.user)
            return Response(serializer.data)

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(
        detail=False,
        methods=['post'],
        permission_classes=[
            IsAuthenticated
        ]
    )
    def change_password(
        self,
        request
    ):

        serializer = ChangePasswordSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = request.user
            if not user.check_password(
                serializer.validated_data[
                    'current_password'
                ]
            ):
                return Response(
                    {
                        'current_password':
                            'Current password is incorrect'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(
                serializer.validated_data['new_password']
            )
            user.save()
            return Response({'detail': 'Password updated successfully'})

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
