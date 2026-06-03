from rest_framework import serializers

from django.contrib.auth import (
    get_user_model
)

from .models import (
    User,
    Resume
)

User = get_user_model()


# ============================================
# USER SERIALIZER
# ============================================

class UserSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = User

        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone'
        ]

        read_only_fields = [
            'id'
        ]


# ============================================
# USER REGISTRATION SERIALIZER
# ============================================

class UserRegistrationSerializer(
    serializers.ModelSerializer
):

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={
            'input_type':
                'password'
        }
    )

    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={
            'input_type':
                'password'
        }
    )

    class Meta:

        model = User

        fields = [
            'username',
            'email',
            'password',
            'password2',
            'first_name',
            'last_name',
            'role',
            'phone'
        ]

    # ========================================
    # VALIDATE PASSWORDS
    # ========================================

    def validate(self, data):

        if (
            data['password']
            !=
            data['password2']
        ):

            raise serializers.ValidationError(
                {
                    "password":
                        "Passwords must match."
                }
            )

        return data

    # ========================================
    # CREATE USER
    # ========================================

    def create(
        self,
        validated_data
    ):

        validated_data.pop(
            'password2'
        )

        password = (
            validated_data.pop(
                'password'
            )
        )

        user = User(
            **validated_data
        )

        user.set_password(
            password
        )

        user.save()

        return user


# ============================================
# RESUME SERIALIZER
# ============================================

class ResumeSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Resume

        fields = [
            'id',
            'headline',
            'summary',
            'skills',
            'education',
            'experience',
            'projects',
            'linkedin_url',
            'github_url',
            'portfolio_url',
            'resume_score',
            'updated_at',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'resume_score',
            'updated_at',
            'created_at'
        ]


# ============================================
# CHANGE PASSWORD SERIALIZER
# ============================================

class ChangePasswordSerializer(
    serializers.Serializer
):

    current_password = (
        serializers.CharField(
            required=True,
            write_only=True
        )
    )

    new_password = (
        serializers.CharField(
            required=True,
            write_only=True,
            min_length=6
        )
    )

    confirm_password = (
        serializers.CharField(
            required=True,
            write_only=True
        )
    )

    # ========================================
    # VALIDATE PASSWORDS
    # ========================================

    def validate(self, data):

        if (
            data['new_password']
            !=
            data['confirm_password']
        ):

            raise serializers.ValidationError(
                {
                    'confirm_password':
                        'Passwords do not match'
                }
            )

        return data