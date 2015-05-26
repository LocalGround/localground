from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from localground.apps.site.api.fields import FileField


class AttachmentSerializer(BaseNamedSerializer):
    overlay_type = serializers.SerializerMethodField()

    class Meta:
        model = models.Attachment
        fields = BaseNamedSerializer.Meta.fields + (
            'overlay_type',
        )


class ScanSerializer(BaseNamedSerializer):
    file_name_orig = FileField(required=False)
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
            'file_name_orig'
        )

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

    '''
	def get_center(self, obj):
		if obj.processed_image is None: return
		return {
			'lat': obj.processed_image.center.y,
			'lng': obj.processed_image.center.x
		}
	'''

    def get_zoom(self, obj):
        if obj.processed_image is None:
            return
        else:
            return obj.processed_image.zoom

    def get_overlay_path(self, obj):
        return obj.processed_map_url_path()
