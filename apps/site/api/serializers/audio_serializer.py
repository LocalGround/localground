import os
from django.conf import settings
from localground.apps.site.api.serializers.base_serializer import GeometrySerializer, GeometrySerializer
from localground.apps.site.api.fields import FileField
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import get_timestamp_no_milliseconds, \
    upload_helpers


class AudioSerializer(GeometrySerializer):
    ext_whitelist = [
        'm4a', 'mp3', 'mp4', 'mpeg', '3gp', 'aif', 'aiff', 'ogg', 'wav'
    ]

    media_file = serializers.CharField(
        source='file_name_orig',
        required=True,
        style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    file_path = serializers.SerializerMethodField('get_file_path_new')

    class Meta:
        model = models.Audio
        fields = GeometrySerializer.Meta.fields + \
            ('file_path', 'media_file', )
        depth = 0

    def get_file_path_new(self, obj):
        obj.media_file.storage.location = obj.get_storage_location()
        return obj.media_file.url

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        # save it to disk
        extras = {
            'attribution': validated_data.get('attribution') or owner.username
        }
        extras.update(self.get_presave_create_dictionary())
        validated_data = {}
        validated_data.update(self.validated_data)
        validated_data.update(extras)
        self.instance = self.Meta.model.objects.create(**validated_data)
        self.instance.process_file(f, owner)
        return self.instance


class AudioSerializerUpdate(AudioSerializer):
    media_file = serializers.CharField(
        source='file_name_orig', required=False, read_only=True
    )
