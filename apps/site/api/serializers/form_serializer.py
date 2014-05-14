from localground.apps.site.api.serializers.base_serializer import BaseSerializer
import datetime
from django.conf import settings
from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields



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




class BaseRecordSerializer(serializers.ModelSerializer):

	geometry = fields.GeometryField(help_text='Assign a GeoJSON string',
							  required=False,
							  widget=widgets.GeoJSONWidget)
	overlay_type = serializers.SerializerMethodField('get_overlay_type')
	url = serializers.SerializerMethodField('get_detail_url')
	project_id = fields.ProjectField(label='project_id', source='project', required=False)
		
	class Meta:
		fields = ('id', 'overlay_type', 'url', 'geometry', 'manually_reviewed', 'project_id')
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
    form_fields.extend(list(form.fields))

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
	col_names = [f.col_name for f in form.fields]
	
	class FormDataSerializer(BaseRecordSerializer):
		recs = serializers.SerializerMethodField('get_recs')
		url = serializers.SerializerMethodField('get_detail_url')
		project_id = serializers.SerializerMethodField('get_project_id')
			
		class Meta:
			model = form.TableModel
			fields = ('id', 'num', 'recs', 'url', 'geometry', 'project_id', 'overlay_type')
			
		def get_recs(self, obj):
			#return [getattr(obj, col_name) for col_name in col_names]
			recs = []
			for col_name in col_names:
				val = getattr(obj, col_name)
				if type(val) is datetime.datetime:
					val = val.strftime('%m/%d/%Y, %I:%M:%S %p')
				recs.append(val)
			return recs
				
		
		def get_detail_url(self, obj):
			return '%s/api/0/forms/%s/data/%s/' % (settings.SERVER_URL,
						form.id, obj.id)
		
		def get_project_id(self, obj):
			return obj.project.id
		
		def get_overlay_type(self, obj):
			return 'record'

	return FormDataSerializer

