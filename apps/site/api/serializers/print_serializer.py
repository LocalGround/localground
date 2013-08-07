from localground.apps.site.api.serializers.base_serializer import ExtentsSerializer
from rest_framework import serializers
from localground.apps.site import models

class PrintSerializer(ExtentsSerializer):
	layout_url = serializers.HyperlinkedRelatedField(view_name='layout-detail', source='layout', read_only=True)
	layout = serializers.SlugRelatedField(label='layout', slug_field='id')
	map_provider = serializers.SlugRelatedField(label='map_provider', slug_field='id')
	map_provider_url = serializers.HyperlinkedRelatedField(view_name='wmsoverlay-detail', source='map_provider', read_only=True)
	pdf = serializers.SerializerMethodField('get_pdf')
	thumb = serializers.SerializerMethodField('get_thumb')
	uuid = serializers.SerializerMethodField('get_uuid')
	instructions = serializers.WritableField(label='instructions', source='description', blank=True)
	map_title = serializers.WritableField(label='map_title', source='name', blank=True)
	
	class Meta:
		model = models.Print
		fields = ('id', 'uuid', 'project_id', 'map_title', 'instructions',
					'tags', 'overlay_type', 'pdf', 'thumb', 'zoom', 'map_provider',
					'map_provider_url', 'layout', 'layout_url', 'center')
		depth = 0
		
	def get_pdf(self, obj):
		return obj.pdf()
	
	def get_thumb(self, obj):
		return obj.thumb()
	
	def get_uuid(self, obj):
		return obj.uuid