from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from django.forms.widgets import Input

class BaseSerializer(serializers.HyperlinkedModelSerializer):
	#tags = fields.TagField(label='tags', required=False, widget=widgets.TagAutocomplete, help_text='Tag your object here')
	tags = serializers.CharField(label='tags', required=False, widget=Input, help_text='Tag your object here')
	name = serializers.CharField(required=False, label='name')
	description = fields.DescriptionField(required=False, label='caption')
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	#tags = serializers.SerializerMethodField('get_tags')
		
	class Meta:
		fields = ('id', 'name', 'description', 'overlay_type', 'tags')
		
	def get_overlay_type(self, obj):
		return obj._meta.verbose_name
	
	def get_tags(self, obj):
		return obj.tags
	
	
class PointSerializer(BaseSerializer):
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)
							  
	project_id = fields.ProjectField(source='project', required=False)
	
	class Meta:
		fields = BaseSerializer.Meta.fields + ('project_id', 'point')
		
		
class MediaPointSerializer(PointSerializer):
	file_name = serializers.Field(source='file_name_new')
	caption = serializers.Field(source='description')
	
	class Meta:
		fields = PointSerializer.Meta.fields + ('attribution',
							'file_name', 'caption')
		
class ExtentsSerializer(BaseSerializer):
	project_id = fields.ProjectField(label='project_id', source='project', required=False)
	center = fields.PointField(label='center', help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)

	class Meta:
		fields = BaseSerializer.Meta.fields + ('project_id', 'center')