from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from localground.apps.site.api.fields import FileField

class AttachmentSerializer(BaseSerializer):
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	
	class Meta:
		model = models.Attachment
		fields = BaseSerializer.Meta.fields + (
			'overlay_type',
		)


class ScanSerializer(BaseSerializer):
	file_name_orig = FileField(required=False, source='file_name_orig')
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	project_id = fields.ProjectField(source='project', required=False)
	north = serializers.SerializerMethodField('get_north')
	south = serializers.SerializerMethodField('get_south')
	east = serializers.SerializerMethodField('get_east')
	west = serializers.SerializerMethodField('get_west')
	#center = serializers.SerializerMethodField('get_center')
	zoom = serializers.SerializerMethodField('get_zoom')
	overlay_path = serializers.SerializerMethodField('get_overlay_path')

	class Meta:
		model = models.Scan
		fields = BaseSerializer.Meta.fields + (
			'overlay_type', 'source_print', 'project_id',
			'north', 'south', 'east', 'west', 'zoom', 'overlay_path',
			'file_name_orig'
		)
	
	def get_north(self, obj):
		if obj.processed_image is None: return
		else: return obj.processed_image.northeast.y
	
	def get_east(self, obj):
		if obj.processed_image is None: return
		else: return obj.processed_image.northeast.x
		
	def get_south(self, obj):
		if obj.processed_image is None: return
		else: return obj.processed_image.southwest.y
	
	def get_west(self, obj):
		if obj.processed_image is None: return
		else: return obj.processed_image.southwest.x
		
	'''
	def get_center(self, obj):
		if obj.processed_image is None: return
		return {
			'lat': obj.processed_image.center.y,
			'lng': obj.processed_image.center.x
		}
	'''
	
	def get_zoom(self, obj):
		if obj.processed_image is None: return
		else: return obj.processed_image.zoom
		
	def get_overlay_path(self, obj):
		return obj.processed_map_url_path()
	
			
	