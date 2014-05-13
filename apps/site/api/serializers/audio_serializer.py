from localground.apps.site.api.serializers.base_serializer import MediaGeometrySerializer
from localground.apps.site.api.fields import FileField

from rest_framework import serializers
from localground.apps.site import models

class AudioSerializer(MediaGeometrySerializer):
	file_name_orig = FileField(required=False, source='file_name_orig')
	file_path = serializers.SerializerMethodField('get_file_path')
	
	class Meta:
		model = models.Audio
		fields = MediaGeometrySerializer.Meta.fields  + ('file_path', 'file_name_orig')
		depth = 0
		
	def get_file_path(self, obj):
		return obj.encrypt_url(obj.file_name_new)