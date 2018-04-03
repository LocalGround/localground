from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
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
        return super(AuditSerializerMixin, self).update(
            instance, validated_data)


class BaseSerializer(
        AuditSerializerMixin, serializers.HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        super(BaseSerializer, self).__init__(*args, **kwargs)
        model_meta = self.Meta.model._meta
        format_kwargs = {
            'app_label': model_meta.app_label,
            'model_name': model_meta.object_name.lower()
        }
    overlay_type = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    def get_owner(self, obj):
        return obj.owner.username

    field_list = ('id', 'overlay_type', 'owner')

    class Meta:
        abstract = True


class NamedSerializerMixin(serializers.ModelSerializer):
    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    name = serializers.CharField(
        required=False, allow_null=True, label='name', allow_blank=True)
    caption = serializers.CharField(
        source='description', required=False, allow_null=True, label='caption',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )

    field_list = ('url', 'id', 'name', 'caption', 'tags')

    class Meta:
        abstract = True


class ProjectSerializerMixin(serializers.ModelSerializer):
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=True
    )

    def get_projects(self):
        if self.context.get('view'):
            view = self.context['view']
            if view.request.user.is_authenticated():
                return models.Project.objects.get_objects(view.request.user)
            else:
                return models.Project.objects.get_objects_public(
                    access_key=view.request.GET.get('access_key')
                )
        elif getattr(self, 'user', None) is not None:
            return models.Project.objects.get_objects(self.user)
        else:
            return models.Project.objects.all()

    def get_fields(self, *args, **kwargs):
        '''
        This code ensures that the user can only add data to the projects for
        which they have access. In addition, if the object has already been
        created, the project cannot be reassigned.
        '''
        fields = super(
            ProjectSerializerMixin, self).get_fields(*args, **kwargs)

        # validation processing for serializers called by views:
        if self.context.get('request'):
            method = self.context.get('request').method
            # raise Exception(method)
            if self.instance or method in ['PUT', 'PATCH', 'GET']:
                fields['project_id'].read_only = True
            else:
                # only writable on create:
                fields['project_id'].queryset = self.get_projects()

        return fields
    field_list = ('project_id',)


class GeometrySerializer1(ProjectSerializerMixin, BaseSerializer):
    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5},
        source='point'
    )
    extras = JSONField(
        help_text='Store arbitrary key / value pairs, e.g. {"key": "value"}',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5})

    class Meta:
        fields = BaseSerializer.field_list + \
            ProjectSerializerMixin.field_list + ('tags', 'geometry', 'extras')


class GeometrySerializer(
        NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer):
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5},
        source='point'
    )
    extras = JSONField(
        help_text='Store arbitrary key / value pairs, e.g. {"key": "value"}',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5})

    class Meta:
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + ('geometry', 'extras')


class MediaGeometrySerializerNew(GeometrySerializer):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    media_file = serializers.CharField(
        source='media_file_orig',
        required=True,
        style={'base_template': 'file.html'},
        # write_only=True,
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )

    def __init__(self, *args, **kwargs):
        super(MediaGeometrySerializerNew, self).__init__(*args, **kwargs)
        if not self.instance:
            return
        try:
            model = self.instance[0]
        except Exception:
            model = self.instance
        # Sets the storage location upon initialization:
        model.media_file_orig.storage.location = model.get_storage_location()

    class Meta:
        fields = GeometrySerializer.Meta.fields + \
            ('attribution', 'media_file')


class ExtentsSerializer(
        NamedSerializerMixin, ProjectSerializerMixin, BaseSerializer):

    center = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        required=False,
        style={'base_template': 'json.html', 'rows': 5}
    )

    class Meta:
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + ('center',)
