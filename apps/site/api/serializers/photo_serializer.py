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

    def __init__(self, *args, **kwargs):
        super(PhotoSerializer, self).__init__(*args, **kwargs)
        # Sets the storage location upon initialization:
        if self.instance:
            self.instance.media_file_orig.storage.location = \
                self.instance.get_storage_location()

    class Meta:
        model = models.Photo
        fields = MediaGeometrySerializerNew.Meta.fields + (
            'path', 'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm'
        )
        depth = 0

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user

        # looks like media_file is the only one being saved
        # onto the amazon cloud storage, but not the others
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # Save it to Amazon S3 cloud
        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': validated_data.get('attribution') or owner.username
        })
        self.instance = self.Meta.model.objects.create(**self.validated_data)
        self.instance.process_file(f)
        return self.instance

    def get_path(self, obj):
        return obj.media_file_orig.url

    def get_path_large(self, obj):
        return obj.media_file_large.url

    def get_path_medium(self, obj):
        return obj.media_file_medium.url

    def get_path_medium_sm(self, obj):
        return obj.media_file_medium_sm.url

    def get_path_small(self, obj):
        return obj.media_file_small.url

    def get_path_marker_lg(self, obj):
        return obj.media_file_marker_lg.url

    def get_path_marker_sm(self, obj):
        return obj.media_file_marker_sm.url


class PhotoSerializerUpdate(PhotoSerializer):
    media_file = serializers.CharField(
        source='media_file_orig', required=False, read_only=True)
