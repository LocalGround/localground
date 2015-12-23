from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer, GeometrySerializer
from localground.apps.site.api.fields import FileField

from rest_framework import serializers
from localground.apps.site import models


class AudioSerializer(MediaGeometrySerializer):
    file_path = serializers.SerializerMethodField('get_file_path_new')

    class Meta:
        model = models.Audio
        fields = MediaGeometrySerializer.Meta.fields + \
            ('file_path', )
        depth = 0

    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

