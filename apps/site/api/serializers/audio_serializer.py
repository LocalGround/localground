from localground.apps.site.api.serializers.base_serializer import MediaPointSerializer
from rest_framework import serializers
from localground.apps.site import models

class AudioSerializer(MediaPointSerializer):
	file_path = serializers.SerializerMethodField('get_file_path')
	
	class Meta:
		model = models.Audio
		fields = MediaPointSerializer.Meta.fields  + ('file_path',)
		depth = 0
		
	def get_file_path(self, obj):
		return obj.encrypt_url(obj.file_name_new)