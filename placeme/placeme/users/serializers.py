from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, Company

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name', 'role', 'phone']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills_list = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'branch', 'cgpa', 'skills', 'skills_list', 'resume_pdf', 
                  'github_link', 'linkedin_link', 'bio', 'resume_score', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'resume_score']

    def get_skills_list(self, obj):
        if obj.skills:
            return [skill.strip() for skill in obj.skills.split(',')]
        return []


class CompanySerializer(serializers.ModelSerializer):
    verified_by = UserSerializer(read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'email', 'industry', 'website', 'logo', 
                  'description', 'verified', 'verified_by', 'created_at']
        read_only_fields = ['id', 'verified_by', 'created_at']
