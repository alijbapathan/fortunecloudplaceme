from rest_framework import serializers
from .models import (
    PlacementDrive, Application, InterviewSchedule, InterviewExperience
)
from users.serializers import UserSerializer, StudentProfileSerializer, CompanySerializer

class PlacementDriveSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True, required=False)
    created_by = UserSerializer(read_only=True)
    applications_count = serializers.SerializerMethodField()

    class Meta:
        model = PlacementDrive
        fields = ['id', 'company', 'company_id', 'role', 'package', 'description', 
                  'eligibility_cgpa', 'required_skills', 'eligible_branches', 'drive_date',
                  'registration_deadline', 'total_positions', 'status', 'created_by',
                  'applications_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class ApplicationSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    drive = PlacementDriveSerializer(read_only=True)
    drive_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Application
        fields = ['id', 'student', 'drive', 'drive_id', 'status', 'match_score', 
                  'applied_at', 'updated_at']
        read_only_fields = ['id', 'student', 'match_score', 'applied_at', 'updated_at']


class InterviewScheduleSerializer(serializers.ModelSerializer):
    application = ApplicationSerializer(read_only=True)
    application_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = InterviewSchedule
        fields = ['id', 'application', 'application_id', 'round_type', 'scheduled_date',
                  'location', 'result', 'feedback', 'created_at']
        read_only_fields = ['id', 'created_at']


class InterviewExperienceSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(read_only=True)
    company = CompanySerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = InterviewExperience
        fields = ['id', 'student', 'company', 'company_id', 'role', 'rounds_description',
                  'difficulty', 'questions_asked', 'tips', 'result', 'created_at', 'updated_at']
        read_only_fields = ['id', 'student', 'created_at', 'updated_at']
