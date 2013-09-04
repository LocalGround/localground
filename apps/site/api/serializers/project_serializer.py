from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.barcoded_serializer import ScanSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.form_serializer import create_record_serializer, create_compact_record_serializer
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
		from django.contrib.contenttypes.models import ContentType
		from localground.apps.site import models
		candidates = [
			models.Photo, models.Audio, models.Scan, models.Project, models.Marker
		]
		forms = (models.Form.objects
					.select_related('projects')
					.prefetch_related('field_set', 'field_set__data_type')
					.filter(projects=obj)
				)
		for form in forms:
			candidates.append(form.TableModel)
		#this caches the ContentTypes so that we don't keep executing one-off queries
		ContentType.objects.get_for_models(*candidates, concrete_model=False)
		children = {
			'photos': self.get_photos(obj),
			'audio': self.get_audio(obj),
			'scans': self.get_scans(obj),
			'markers': self.get_markers(obj, forms)
		}
		
		#add table data:
		for form in forms:
			form_data = self.get_table_records(obj, form)
			if len(form_data.get('data')) > 0:
				children['form_%s' % form.id] = form_data
		return children
	
	def get_table_records(self, obj, form):
		SerializerClass = create_compact_record_serializer(form)
		data = SerializerClass(
				form.get_objects(obj.owner)
			).data
		d = self.serialize_list(
				form.TableModel,
				data,
				name=form.name,
				overlay_type='record',
				model_name_plural='form_%s' % form.id
			)
		d.update({
			'headers': [f.col_alias for f in form.get_fields()]	
		})
		return d
		
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
				models.Scan.objects.get_objects(obj.owner, project=obj, processed_only=True)
			).data
		return self.serialize_list(models.Scan, data)
	
	def get_markers(self, obj, forms):
		data = MarkerSerializerCounts(
				models.Marker.objects.get_objects_with_counts(obj.owner, project=obj, forms=forms)
			).data
		return self.serialize_list(models.Marker, data)
	
	
	def serialize_list(self, cls, data, name=None, overlay_type=None,
					   model_name_plural=None):
		if name is None:
			name = cls.model_name_plural.title()
		if overlay_type is None:
			overlay_type = cls.model_name
		if model_name_plural is None:
			model_name_plural = cls.model_name_plural
		return {
			'id': model_name_plural,
			'name': name,
			'overlay_type': overlay_type,
			'data': data
		}
