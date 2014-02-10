from rest_framework import serializers, relations
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from django.forms.widgets import Input

class UrlField(relations.HyperlinkedIdentityField):
	
	def get_url(self, obj, view_name, request, format):
		url = super(UrlField, self).get_url(obj, view_name, request, format)
		if request and request.GET.get('access_key'):
			url += '?access_key=%s' % request.GET.get('access_key')
		return url

class BaseSerializer(serializers.HyperlinkedModelSerializer):
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
		super(BaseSerializer, self).__init__(*args, **kwargs)

		if self.opts.view_name is None:
			self.opts.view_name = self._get_default_view_name(self.opts.model)

		url_field = UrlField(
			view_name=self.opts.view_name,
			lookup_field=self.opts.lookup_field
		)
		url_field.initialize(self, 'url')
		self.fields['url'] = url_field
		
		# Extra Sneaky:  give access to the request object in the
		# HyperlinkedSerializer so that child objects can also use
		# it:
		self.request = url_field.context.get('request', None)
		
	
	class Meta:
		fields = ('id', 'name', 'description', 'overlay_type', 'tags', 'owner')
		
	def get_overlay_type(self, obj):
		return obj._meta.verbose_name
	
	def get_owner(self, obj):
		return obj.owner.username

	
class PointSerializer(BaseSerializer):
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)
							  
	project_id = fields.ProjectField(source='project', required=False)
	
	class Meta:
		fields = BaseSerializer.Meta.fields + ('project_id', 'point', 'owner')
		
		
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