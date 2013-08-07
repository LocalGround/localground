from localground.apps.site.api.serializers.base_serializer import MediaPointSerializer
from rest_framework import serializers
from localground.apps.site import models

class PhotoSerializer(MediaPointSerializer):
	path_large = serializers.SerializerMethodField('get_path_large')
	path_medium = serializers.SerializerMethodField('get_path_medium')
	path_medium_sm = serializers.SerializerMethodField('get_path_medium_sm')
	path_small = serializers.SerializerMethodField('get_path_small')
	path_marker_lg = serializers.SerializerMethodField('get_path_marker_lg')
	path_marker_sm = serializers.SerializerMethodField('get_path_path_marker_sm')
	overlay_type = serializers.SerializerMethodField('get_overlay_type')

	class Meta:
		model = models.Photo
		fields = MediaPointSerializer.Meta.fields + (
					'path_large', 'path_medium', 'path_medium_sm',
					'path_small', 'path_marker_lg', 'path_marker_sm'
				)
		depth = 1
	
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
	
	def get_path_path_marker_sm(self, obj):
		return obj.encrypt_url(obj.file_name_marker_sm)