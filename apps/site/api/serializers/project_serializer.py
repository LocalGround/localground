from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.barcoded_serializer import ScanSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.form_serializer import DynamicFormDataSerializerBuilder
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
	children = serializers.SerializerMethodField('get_children')
	
	class Meta:
		model = models.Project
		fields = BaseSerializer.Meta.fields + (
			'slug', 'children'
		)
		depth = 0
		
	def get_children(self, obj):
		children = {
			'photos': self.get_photos(obj),
			'audio': self.get_audio(obj),
			'scans': self.get_scans(obj),
			'markers': self.get_markers(obj)
		}
		
		#add table data:
		forms = models.Form.objects.filter(project=obj)
		for form in forms:
			form_data = self.get_table_records(obj, form)
			if len(form_data.get('data')) > 0:
				children['form_%s' % form.id] = form_data
		return children
	
	def get_table_records(self, obj, form):
		builder = DynamicFormDataSerializerBuilder(form)
		data = builder.SerializerClass(
				form.get_objects(obj.owner)
			).data
		return self.serialize_list(form.TableModel, data, name=form.name, overlay_type='record') 
		
	def get_photos(self, obj):
		data = PhotoSerializer(
				models.Photo.objects.get_objects(obj.owner, project=obj)
			).data
		return self.serialize_list(models.Photo, data)    
	
	def get_audio(self, obj):
		data = AudioSerializer(
				models.Audio.objects.get_objects(obj.owner, project=obj)
			).data
		return self.serialize_list(models.Audio, data)
	
	def get_scans(self, obj):
		data = ScanSerializer(
				models.Scan.objects.get_objects(obj.owner, project=obj)
			).data
		return self.serialize_list(models.Scan, data)
	
	def get_markers(self, obj):
		data = MarkerSerializerCounts(
				models.Marker.objects.get_objects_with_counts(obj.owner, project=obj)
			).data
		return self.serialize_list(models.Marker, data)
	
	#def get_table_data(self, obj):
	#	return obj.get_table_data()[0]
	
	
	def serialize_list(self, cls, data, name=None, overlay_type=None):
		if name is None:
			name = cls.model_name_plural.title()
		if overlay_type is None:
			overlay_type = cls.model_name
		return {
			'id': cls.model_name_plural,
			'name': name,
			'overlay_type': overlay_type,
			'data': data
		}
'''		
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
	
	'''