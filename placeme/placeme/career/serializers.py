from rest_framework import serializers

from .models import (
    StudentProfile,
    Project
)


# ============================================
# PROJECT SERIALIZER
# ============================================

class ProjectSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Project

        fields = [
            'id',
            'title',
            'description',
            'tech_stack',
            'github_url',
            'live_url',
            'featured',
            'created_at'
        ]

        read_only_fields = [
            'id',
            'created_at'
        ]


# ============================================
# STUDENT PROFILE SERIALIZER
# ============================================

class StudentProfileSerializer(
    serializers.ModelSerializer
):

    user = serializers.StringRelatedField(
        read_only=True
    )

    projects = ProjectSerializer(
        many=True,

        read_only=True
    )

    def to_internal_value(self, data):
        if hasattr(data, 'copy'):
            mutable = data.copy()
        else:
            mutable = dict(data)

        for field in ('graduation_year', 'backlogs'):
            if mutable.get(field) == '':
                mutable[field] = None

        resume = mutable.get('resume')
        if resume is not None and not hasattr(resume, 'read'):
            mutable.pop('resume', None)

        return super().to_internal_value(mutable)

    class Meta:

        model = StudentProfile

        fields = [
            'id',
            'user',

            # BASIC
            'profile_picture',
            'headline',
            'about',
            'location',

            # ACADEMIC
            'branch',
            'graduation_year',
            'cgpa',
            'backlogs',

            # SKILLS
            'skills',

            # LINKS
            'github_url',
            'linkedin_url',
            'portfolio_url',
            'leetcode_url',

            # RESUME
            'resume',

            # PROFILE
            'profile_completion',

            # PROJECTS
            'projects',

            # TIMESTAMPS
            'created_at',
            'updated_at'
        ]

        read_only_fields = [
            'id',
            'profile_completion',
            'created_at',
            'updated_at'
        ]