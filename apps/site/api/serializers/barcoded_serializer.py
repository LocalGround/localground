from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import fields
from django.forms.fields import FileField
from localground.apps.site.api.fields import FileField

class ScanSerializerCreate(BaseNamedSerializer):
    file_path = serializers.SerializerMethodField('get_file_path_new')
    #file_name_orig = FileField(required=True)
    file_name_orig = serializers.CharField(required=True, style={'base_template': 'file.html'})
    overlay_type = serializers.SerializerMethodField()
    project_id = fields.ProjectField(source='project', required=False)
    north = serializers.SerializerMethodField()
    south = serializers.SerializerMethodField()
    east = serializers.SerializerMethodField()
    west = serializers.SerializerMethodField()
    zoom = serializers.SerializerMethodField()
    overlay_path = serializers.SerializerMethodField()

    class Meta:
        model = models.Scan
        fields = BaseNamedSerializer.Meta.fields + (
            'overlay_type', 'source_print', 'project_id',
            'north', 'south', 'east', 'west', 'zoom', 'overlay_path',
            'file_name_orig', 'file_path'
        )
        
    def create(self, validated_data):
        raise Exception(validated_data)
        from localground.apps.lib.helpers import generic
        validated_data.update({
            'uuid': generic.generateID(),
            'status': models.StatusCode.objects.get(id=3),
            'upload_source': models.UploadSource.objects.get(id=1),
            'host': settings.SERVER_HOST
        })
        return models.Scan.objects.create(**validated_data)

    def get_file_path_new(self, obj):
        return obj.encrypt_url(obj.file_name_new)

    def get_north(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.northeast.y

    def get_east(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.northeast.x

    def get_south(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.southwest.y

    def get_west(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.southwest.x

    def get_zoom(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.zoom

    def get_overlay_path(self, obj):
        return obj.processed_map_url_path()
    
class ScanSerializerUpdate(ScanSerializerCreate):
    file_name_orig = serializers.CharField(required=False, read_only=True)

