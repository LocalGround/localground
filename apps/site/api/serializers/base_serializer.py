from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from django.forms.widgets import Input

class BaseSerializer(serializers.HyperlinkedModelSerializer):
	def __init__(self, *args, **kwargs):
		super(BaseSerializer, self).__init__(*args, **kwargs)
		if not hasattr(self.opts, 'view_name'):
			#method of the DRF's serializers.HyperlinkedModelSerializer class:
			self.opts.view_name = self._get_default_view_name(self.opts.model)
			
		url_field = fields.UrlField(
			view_name=self.opts.view_name,
			lookup_field=self.opts.lookup_field
		)
		url_field.initialize(self, 'url')
		self.fields['url'] = url_field
		
		# Extra Sneaky:  give access to the request object in the
		# HyperlinkedSerializer so that child objects can also use
		# it:
		self.request = url_field.context.get('request', None)



class BaseNamedSerializer(BaseSerializer):
	tags = fields.TagField(label='tags', required=False, widget=widgets.TagAutocomplete, help_text='Tag your object here')
	name = serializers.CharField(required=False, label='name')
	description = fields.DescriptionField(required=False, label='caption')
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	owner = serializers.SerializerMethodField('get_owner')
	
	def __init__(self, *args, **kwargs):
		'''
		Overriding HyperlinkedModelSerializer constructor to use a
		slightly altered version of the HyperlinkedIdentityField class
		that takes some query params into account.
		'''
		super(BaseNamedSerializer, self).__init__(*args, **kwargs)	
	
	class Meta:
		fields = ('id', 'name', 'description', 'overlay_type', 'tags', 'owner')
		
	def get_overlay_type(self, obj):
		return obj._meta.verbose_name
	
	def get_owner(self, obj):
		return obj.owner.username

	
class GeometrySerializer(BaseNamedSerializer):
	geometry = fields.GeometryField(help_text='Assign a GeoJSON string',
							  required=False,
							  widget=widgets.JSONWidget)
	
	project_id = fields.ProjectField(source='project', required=False)
	
	class Meta:
		fields = BaseNamedSerializer.Meta.fields + ('project_id', 'geometry', 'owner')
		
		
class MediaGeometrySerializer(GeometrySerializer):
	file_name = serializers.Field(source='file_name_new')
	caption = serializers.Field(source='description')
	
	class Meta:
		fields = GeometrySerializer.Meta.fields + ('attribution',
							'file_name', 'caption')
		
class ExtentsSerializer(BaseNamedSerializer):
	project_id = fields.ProjectField(label='project_id', source='project', required=False)
	center = fields.GeometryField(help_text='Assign a GeoJSON string',
							  required=False,
							  widget=widgets.JSONWidget,
							  point_field_name='center')

class Meta:
    fields = BaseNamedSerializer.Meta.fields + ('project_id', 'center')
