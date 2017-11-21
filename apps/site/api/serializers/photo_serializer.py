import os, sys
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.fields import FileField
from localground.apps.lib.helpers import upload_helpers, generic

class PhotoSerializer(MediaGeometrySerializer):
    path_large = serializers.SerializerMethodField()
    path_medium = serializers.SerializerMethodField()
    path_medium_sm = serializers.SerializerMethodField()
    path_small = serializers.SerializerMethodField()
    path_marker_lg = serializers.SerializerMethodField()
    path_marker_sm = serializers.SerializerMethodField()

    #help_text='Valid file types are: ' + ', '.join(ext_whitelist)

    class Meta:
        model = models.Photo
        fields = MediaGeometrySerializer.Meta.fields + (
            'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        )
        depth = 0

    def get_path_large(self, obj):
        return obj.encrypt_url(obj.file_name_large)

    def get_path_medium(self, obj):
        return obj.encrypt_url(obj.file_name_medium)

    def get_path_medium_sm(self, obj):
        return obj.encrypt_url(obj.file_name_medium_sm)

    def get_path_small(self, obj):
        return obj.encrypt_url(obj.file_name_small)

    def get_path_marker_lg(self, obj):
        return obj.encrypt_url(obj.file_name_marker_lg)

    def get_path_marker_sm(self, obj):
        return obj.encrypt_url(obj.file_name_marker_sm)

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # save it to disk
        data = models.Photo.process_file(f, owner)
        data.update(self.get_presave_create_dictionary())
        data.update({
            'attribution': validated_data.get('attribution') or owner.username,
            'host': settings.SERVER_HOST
        })
        data.update(validated_data)
        self.instance = self.Meta.model.objects.create(**data)
        return self.instance

class PhotoSerializerUpdate(PhotoSerializer):
    media_file = serializers.CharField(source='file_name_orig', required=False, read_only=True)
