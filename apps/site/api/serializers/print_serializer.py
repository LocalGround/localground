from localground.apps.site.api.serializers.base_serializer import ExtentsSerializer
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.widgets import TagAutocomplete
from django.forms import widgets
from localground.apps.site.api import fields

class PrintSerializerMixin(serializers.ModelSerializer):
	uuid = serializers.SerializerMethodField('get_uuid')
	layout_url = serializers.HyperlinkedRelatedField(view_name='layout-detail', source='layout', read_only=True)
	map_provider_url = serializers.HyperlinkedRelatedField(view_name='wmsoverlay-detail', source='map_provider', read_only=True)
	pdf = serializers.SerializerMethodField('get_pdf')
	thumb = serializers.SerializerMethodField('get_thumb')
	instructions = serializers.WritableField(label='instructions', source='description', blank=True, widget=widgets.Textarea)
	map_title = serializers.WritableField(label='map_title', source='name', blank=True)
	tags = fields.TagField(label='tags', required=False, widget=TagAutocomplete, help_text='Tag your object here')
	
	def get_pdf(self, obj):
		return obj.pdf()
	
	def get_thumb(self, obj):
		return obj.thumb()
	
	def get_uuid(self, obj):
		return obj.uuid
	
	class Meta:
		abstract = True
	

class PrintSerializer(ExtentsSerializer, PrintSerializerMixin):
	layout = serializers.SlugRelatedField(label='layout', slug_field='id')
	map_provider = serializers.SlugRelatedField(label='map_provider', slug_field='id')
	
	class Meta:
		model = models.Print
		fields = ('id', 'uuid', 'project_id', 'map_title', 'instructions',
					'tags', 'overlay_type', 'pdf', 'thumb', 'zoom', 'map_provider',
					'map_provider_url', 'layout', 'layout_url', 'center')
		fields_read_only = ('id', 'uuid')
		depth = 0
		


class PrintSerializerDetail(serializers.HyperlinkedModelSerializer, PrintSerializerMixin):
	center = serializers.SerializerMethodField('get_center')
	layout = serializers.SerializerMethodField('get_layout')
	map_provider = serializers.SerializerMethodField('get_map_provider')
	
	class Meta:
		model = models.Print
		fields = ('id', 'uuid', 'map_title', 'instructions',
					'tags', 'pdf', 'thumb', 'zoom', 'map_provider', 'map_provider_url',
					'layout', 'layout_url', 'center')
		
		read_only_fields = ('zoom',)
		depth = 0
		
	
	def get_center(self, obj):
		return {
			'lat': obj.center.y,
			'lng': obj.center.x
		}
	
	def get_map_provider(self, obj):
		return obj.map_provider.id
	
	def get_layout(self, obj):
		return obj.layout.id
	
	