import os
import sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer \
    import MediaGeometrySerializerNew
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic


class PhotoSerializer(MediaGeometrySerializerNew):
    path = serializers.SerializerMethodField()
    path_large = serializers.SerializerMethodField()
    path_medium = serializers.SerializerMethodField()
    path_medium_sm = serializers.SerializerMethodField()
    path_small = serializers.SerializerMethodField()
    path_marker_lg = serializers.SerializerMethodField()
    path_marker_sm = serializers.SerializerMethodField()

    class Meta:
        model = models.Photo
        fields = MediaGeometrySerializerNew.Meta.fields + (
            'media_file', 'path', 'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        )
        depth = 0

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # Save it to Amazon S3 cloud
        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': owner.username
        })
        self.validated_data.update(validated_data)
        self.instance = self.Meta.model.objects.create(**self.validated_data)
        self.instance.process_file(f, name=self.validated_data.get('name'))
        return self.instance

    def get_path(self, obj):
        try:
            return obj.media_file_orig.url
        except Exception:
            return None

    def get_path_large(self, obj):
        try:
            return obj.media_file_large.url
        except Exception:
            return None

    def get_path_medium(self, obj):
        try:
            return obj.media_file_medium.url
        except Exception:
            return None

    def get_path_medium_sm(self, obj):
        try:
            return obj.media_file_medium_sm.url
        except Exception:
            return None

    def get_path_small(self, obj):
        try:
            return obj.media_file_small.url
        except Exception:
            return None

    def get_path_marker_lg(self, obj):
        try:
            return obj.media_file_marker_lg.url
        except Exception:
            return None

    def get_path_marker_sm(self, obj):
        try:
            return obj.media_file_marker_sm.url
        except Exception:
            return None


class PhotoSerializerUpdate(PhotoSerializer):
    media_file = serializers.CharField(
        source='media_file_orig', required=False, read_only=True)
