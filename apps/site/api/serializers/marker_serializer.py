from localground.apps.site.api.serializers.base_serializer import PointSerializer
from localground.apps.site.api.serializers.photo_serializer import PhotoSerializer
from localground.apps.site.api.serializers.audio_serializer import AudioSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings

class MarkerSerializer(PointSerializer):
	photos = serializers.SerializerMethodField('get_photos')
	photo_links = serializers.SerializerMethodField('get_url_photos')
	audio_links = serializers.SerializerMethodField('get_url_audio')
	audio = serializers.SerializerMethodField('get_audio')
	color = fields.ColorField(required=False)
	point = fields.PointField(widget=widgets.PointWidgetTextbox, required=False)
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + \
			('photos', 'audio', 'color', 'photo_links', 'audio_links')
		depth = 0
		
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
	
class MarkerSerializerCounts(MarkerSerializer):
	photo_count = serializers.SerializerMethodField('get_photo_count')
	audio_count = serializers.SerializerMethodField('get_audio_count')
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=True) 
	class Meta:
		model = models.Marker
		fields = PointSerializer.Meta.fields + ('photo_count', 'audio_count',
									'color', 'photo_links', 'audio_links')
		depth = 0
		
	def get_photo_count(self, obj):
		try: return obj.photo_count
		except: return None
	
	def get_audio_count(self, obj):
		try: return obj.audio_count
		except: return None    