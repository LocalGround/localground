from localground.apps.site.api.serializers.base_serializer import PointSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from localground.apps.site.api.serializers.scan_serializer import ScanSerializer
from localground.apps.site.api.serializers.form_serializer import create_compact_record_serializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings

class MarkerSerializer(PointSerializer):
	#photos = serializers.SerializerMethodField('get_photos')
	#photo_links = serializers.SerializerMethodField('get_url_photos')
	#audio_links = serializers.SerializerMethodField('get_url_audio')
	#audio = serializers.SerializerMethodField('get_audio')
	children = serializers.SerializerMethodField('get_children')
	color = fields.ColorField(required=False)
	point = fields.PointField(widget=widgets.PointWidgetTextbox, required=False)
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + \
			('children', 'color')
					#, 'photos', 'audio', 'photo_links', 'audio_links')
		depth = 0
	
	def get_children(self, obj):
		children = {
			'audio': self.get_audio(obj),
			'photos': self.get_photos(obj),
			'map_images': self.get_map_images(obj)
		}
		
		#add table data:
		for form, records in obj.records.items():
			SerializerClass = create_compact_record_serializer(form)
			d = self.serialize_list(
					form.TableModel,
					SerializerClass(records).data,
					name=form.name,
					overlay_type='record',
					model_name_plural='form_%s' % form.id
				)
			#d.update({
			#	'headers': [f.col_alias for f in form.get_fields()]	
			#})
			children['form_%s' % form.id] = d
		return children
		
		
	def get_photos(self, obj):
		data = PhotoSerializer(obj.photos).data
		return self.serialize_list(models.Photo, data)    
	
	def get_audio(self, obj):
		data = AudioSerializer(obj.audio).data
		return self.serialize_list(models.Audio, data)
	
	def get_map_images(self, obj):
		data = ScanSerializer(obj.map_images).data
		return self.serialize_list(models.Scan, data)
	
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
	
	'''
	def _get_url_children(self, obj, model_name_plural):
		return '%s/api/0/%s/%s/%s/' % (settings.SERVER_URL,
					self.Meta.model.model_name_plural, obj.id,
					model_name_plural)
		
	def get_url_photos(self, obj):
		return self._get_url_children(obj, 'photos')
	
	def get_url_audio(self, obj):
		return self._get_url_children(obj, 'audio')
	
	
	def serialize_nested_objects(self, id, Serializer, data, cls):
		serialized = []
		for item in data:
			d = Serializer(item).data
			d.update({
				'relation': '%s/api/0/%s/%s/%s/%s/' % (settings.SERVER_URL,
					'markers', id, cls.model_name_plural, item.id)    
			})
			serialized.append(d)
		return serialized
		
	def get_photos(self, obj):
		return {
			'id': models.Photo.model_name,
			'name': models.Photo.model_name_plural.title(),
			'overlay_type': models.Photo.model_name,
			'data': self.serialize_nested_objects(obj.id, PhotoSerializer, obj.photos, models.Photo)
		}
	
	def get_audio(self, obj):
		return {
			'id': models.Audio.model_name,
			'name': models.Audio.model_name_plural.title(),
			'overlay_type': models.Audio.model_name,
			'data': self.serialize_nested_objects(obj.id, AudioSerializer, obj.audio, models.Audio)
		}
	'''
	
class MarkerSerializerCounts(MarkerSerializer):
	photo_count = serializers.SerializerMethodField('get_photo_count')
	audio_count = serializers.SerializerMethodField('get_audio_count')
	record_count = serializers.SerializerMethodField('get_dynamic_data_count')
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=True) 
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + ('photo_count', 'audio_count',
									'color', 'record_count') #
		#'photo_links', 'audio_links')
		depth = 0
		
	def get_photo_count(self, obj):
		try: return obj.photo_count
		except: return None
	
	def get_audio_count(self, obj):
		try: return obj.audio_count
		except: return None
		
	def get_dynamic_data_count(self, obj):
		'''
		Gets the total count of all records, regardless of the form
		to which the record is associated.  This technique should
		probably be revisited
		'''
		count = 0
		for attr in dir(obj):
			if attr.startswith('form_'): count += getattr(obj, attr)
		return count



		