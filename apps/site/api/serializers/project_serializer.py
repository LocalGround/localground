from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.barcoded_serializer import ScanSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.marker_serializer import MarkerSerializerCounts
from rest_framework import serializers
from localground.apps.site import models

class ProjectSerializer(BaseSerializer):
	class Meta:
		model = models.Project
		fields = BaseSerializer.Meta.fields + ('owner', 'slug')
		read_only_fields = ('owner',)
		depth = 0
		
class ProjectDetailSerializer(BaseSerializer):
	photos = serializers.SerializerMethodField('get_photos')
	audio = serializers.SerializerMethodField('get_audio')
	markers = serializers.SerializerMethodField('get_markers')
	scans = serializers.SerializerMethodField('get_scans')
	#records = serializers.SerializerMethodField('get_table_data')
	
	class Meta:
		model = models.Project
		fields = BaseSerializer.Meta.fields + (
			'slug', 'photos', 'audio', 'markers', 'scans'
		)
		depth = 0
		
	def get_photos(self, obj):
		data = PhotoSerializer(
				models.Photo.objects.get_objects(obj.owner, project=obj)
			).data
		return self.get_children(models.Photo, obj, data)    
	
	def get_audio(self, obj):
		data = AudioSerializer(
				models.Audio.objects.get_objects(obj.owner, project=obj)
			).data
		return self.get_children(models.Audio, obj, data)
	
	def get_scans(self, obj):
		data = ScanSerializer(
				models.Scan.objects.get_objects(obj.owner, project=obj)
			).data
		return self.get_children(models.Scan, obj, data)
	
	def get_markers(self, obj):
		data = MarkerSerializerCounts(
				models.Marker.objects.get_objects_with_counts(obj.owner, project=obj)
			).data
		return self.get_children(models.Marker, obj, data)
	
	#def get_table_data(self, obj):
	#	return obj.get_table_data()[0]
	
	
	def get_children(self, cls, obj, data):
		return {
			'id': cls.model_name_plural,
			'name': cls.model_name_plural.title(),
			'overlay_type': cls.model_name,
			'data': data
		}