from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.fields import FileField


class PhotoSerializer(MediaGeometrySerializer):
    file_name_orig = serializers.CharField(required=False, read_only=True)
    path_large = serializers.SerializerMethodField()
    path_medium = serializers.SerializerMethodField()
    path_medium_sm = serializers.SerializerMethodField()
    path_small = serializers.SerializerMethodField()
    path_marker_lg = serializers.SerializerMethodField()
    path_marker_sm = serializers.SerializerMethodField()

    class Meta:
        model = models.Photo
        fields = MediaGeometrySerializer.Meta.fields + (
            'path_large', 'path_medium', 'path_medium_sm',
            'path_small', 'path_marker_lg', 'path_marker_sm',
            'file_name_orig'
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
