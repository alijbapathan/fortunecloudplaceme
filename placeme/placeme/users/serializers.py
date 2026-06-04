from rest_framework import serializers
from django.contrib.auth import get_user_model
from placement.models import Company
from .models import Resume

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone',
            'company_name'
        ]
        read_only_fields = ['id']

    def get_company_name(self, obj):
        try:
            return obj.company.name
        except Company.DoesNotExist:
            return None


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={
            'input_type': 'password'
        }
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={
            'input_type': 'password'
        }
    )
    company_name = serializers.CharField(required=False, allow_blank=True)
    company_website = serializers.URLField(required=False, allow_blank=True)

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
            'phone',
            'company_name',
            'company_website'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                'password': 'Passwords must match.'
            })
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', '')
        company_website = validated_data.pop('company_website', '')
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == 'recruiter':
            Company.objects.create(
                name=company_name or user.username,
                website=company_website,
                recruiter=user
            )

        return user


class ResumeSerializer(serializers.ModelSerializer):
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
        read_only_fields = ['id', 'resume_score', 'updated_at', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, min_length=6)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match'
            })
        return data
