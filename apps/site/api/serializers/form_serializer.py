from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.widgets import SnippetWidget, CustomDateTimeWidget
from localground.apps.site.api import fields
from rest_framework import serializers
from localground.apps.site import models
from django.forms import widgets
from django.conf import settings

class FormSerializer(BaseSerializer):
	project_ids = fields.ProjectsField(
					label='project_ids',
					source='projects',
					required=True,
					help_text='A comma-separated list of all of the projects to which this form should belong'
				)
	data_url = serializers.SerializerMethodField('get_data_url')
	class Meta:
		model = models.Form
		fields = BaseSerializer.Meta.fields + ('data_url', 'project_ids')
		depth = 0
		
	def get_data_url(self, obj):
		return '%s/api/0/forms/%s/data/' % (settings.SERVER_URL, obj.pk)
	


from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields

class BaseRecordSerializer(serializers.ModelSerializer):
	point = fields.PointField(help_text='Assign lat/lng field',
							  widget=widgets.PointWidgetTextbox,
							  required=False)
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	url = serializers.SerializerMethodField('get_detail_url')
	project_id = fields.ProjectField(label='project_id', source='project', required=True)
		
	class Meta:
		fields = ('id', 'overlay_type', 'url', 'point', 'manually_reviewed', 'project_id')
		read_only_fields = ('manually_reviewed',)
		
	def get_overlay_type(self, obj):
		return obj._meta.verbose_name
	
	def get_detail_url(self, obj):
		return '%s/api/0/forms/%s/data/%s/' % (settings.SERVER_URL,
					obj.form.id, obj.id)
	
def create_record_serializer(form):
	"""
	generate a dynamic serializer from dynamic model
	"""
	form_fields = []
	form_fields.append(form.get_num_field())
	form_fields.extend(list(form.get_fields()))
	
	field_names = [f.col_name for f in form_fields]
			
	class FormDataSerializer(BaseRecordSerializer):
		class Meta:
			from django.forms import widgets
			model = form.TableModel
			fields = BaseRecordSerializer.Meta.fields + tuple(field_names)
			read_only_fields = BaseRecordSerializer.Meta.read_only_fields
			
	return FormDataSerializer
	

def create_compact_record_serializer(form):
	"""
	generate a dynamic serializer from dynamic model
	"""
	col_names = [f.col_name for f in form.get_fields()]
	
	class FormDataSerializer(BaseRecordSerializer):
		recs = serializers.SerializerMethodField('get_recs')
		url = serializers.SerializerMethodField('get_detail_url')
		project_id = serializers.SerializerMethodField('get_project_id')
			
		class Meta:
			model = form.TableModel
			fields = ('id', 'num', 'recs', 'url', 'point', 'project_id', 'overlay_type')
			
		def get_recs(self, obj):
			return [getattr(obj, col_name) for col_name in col_names]
		
		def get_detail_url(self, obj):
			return '%s/api/0/forms/%s/data/%s/' % (settings.SERVER_URL,
						form.id, obj.id)
		
		def get_project_id(self, obj):
			return form.project.id
		
		def get_overlay_type(self, obj):
			return 'record'

	return FormDataSerializer
	
