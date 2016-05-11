from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from localground.apps.site.models import BaseNamed
from django.forms.widgets import Input
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api.fields.json_fields import JSONField

'''
On Mixins: read this:
https://www.ianlewis.org/en/mixins-and-python

In Python the class hierarchy is defined right to left,
so in the example...

class MyClass(BaseClass, Mixin1, Mixin2):
    pass

...the Mixin2 class is the base class,
extended by Mixin1 and finally by BaseClass.
'''
class AuditSerializerMixin(object):
    def get_presave_create_dictionary(self):
        return {
            'owner': self.context.get('request').user,
            'last_updated_by': self.context.get('request').user,
            'time_stamp': get_timestamp_no_milliseconds()
        }

    def get_presave_update_dictionary(self):
        return {
            'last_updated_by': self.context.get('request').user,
            'time_stamp': get_timestamp_no_milliseconds()
        }
    
    def create(self, validated_data):
        # Extend to add auditing information:
        validated_data.update(self.get_presave_create_dictionary())
        return super(AuditSerializerMixin, self).create(validated_data)
    
    def update(self, instance, validated_data):
        # Extend to add auditing information:
        validated_data.update(self.get_presave_update_dictionary())
        return super(AuditSerializerMixin, self).update(instance, validated_data)

class BaseSerializer(AuditSerializerMixin, serializers.HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        super(BaseSerializer, self).__init__(*args, **kwargs)
        model_meta = self.Meta.model._meta
        format_kwargs = {
            'app_label': model_meta.app_label,
            'model_name': model_meta.object_name.lower()
        }
    
    class Meta:
        fields = ('id',)


class BaseNamedSerializer(BaseSerializer):
    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    name = serializers.CharField(required=False, allow_null=True, label='name', allow_blank=True)
    caption = serializers.CharField(
        source='description', required=False, allow_null=True, label='caption',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )
    overlay_type = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    
    def get_projects(self):
        if self.context.get('view'):
            view = self.context['view']
            if view.request.user.is_authenticated():
                return models.Project.objects.get_objects(view.request.user)
            else:
                return models.Project.objects.get_objects_public(
                    access_key=view.request.GET.get('access_key')
                )
        else:
            return models.Project.objects.all()

    class Meta:
        #model = BaseNamed
        fields = ('url', 'id', 'name', 'caption', 'overlay_type', 'tags', 'owner')

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    def get_owner(self, obj):
        return obj.owner.username


class GeometrySerializer(BaseNamedSerializer):
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5},
        source='point'
    )
    extras = JSONField(
        help_text='Store arbitrary key / value pairs here in JSON form. Example: {"key": "value"}',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5})
    
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False
    )
    
    def get_fields(self, *args, **kwargs):
        fields = super(GeometrySerializer, self).get_fields(*args, **kwargs)
        #restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        fields = BaseNamedSerializer.Meta.fields + \
            ('project_id', 'geometry', 'extras')


class MediaGeometrySerializer(GeometrySerializer):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    file_name = serializers.CharField(source='file_name_new', required=False, read_only=True)
    media_file = serializers.CharField(
        source='file_name_orig', required=True, style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )
    file_path_orig = serializers.SerializerMethodField()

    class Meta:
        fields = GeometrySerializer.Meta.fields + ('attribution', 'file_name', 'media_file',
                                                   'file_path_orig')
        
    def get_file_path_orig(self, obj):
        # original file gets renamed to file_name_new in storage
        # (spaces, etc. removed)
        return obj.encrypt_url(obj.file_name_new)



class ExtentsSerializer(BaseNamedSerializer):
    project_id = fields.ProjectField(
        label='project_id',
        source='project',
        required=False)
    center = fields.GeometryField(
                        help_text='Assign a GeoJSON string',
                        required=False,
                        style={'base_template': 'json.html', 'rows': 5}
                    )


class Meta:
    fields = BaseNamedSerializer.Meta.fields + ('project_id', 'center')
