from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer, GeometrySerializer
from localground.apps.site.api.fields import FileField

from rest_framework import serializers
from localground.apps.site import models


class AudioSerializer(GeometrySerializer):
    file_name_orig = serializers.CharField(required=False, read_only=True)
    file_path = serializers.SerializerMethodField('get_file_path_new')

    class Meta:
        model = models.Audio
        fields = GeometrySerializer.Meta.fields + \
            ('file_path', 'file_name_orig')
        depth = 0

    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)
