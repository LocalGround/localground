from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from django.forms.widgets import Input


class BaseSerializer(serializers.HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        super(BaseSerializer, self).__init__(*args, **kwargs)
        model_meta = self.Meta.model._meta
        format_kwargs = {
            'app_label': model_meta.app_label,
            'model_name': model_meta.object_name.lower()
        }

    class Meta:
        fields = ('id',)


class BaseNamedSerializer(serializers.HyperlinkedModelSerializer):
    tags = serializers.CharField(required=False, allow_null=True, label='tags',
                                    help_text='Tag your object here', allow_blank=True)
    name = serializers.CharField(required=False, allow_null=True, label='name', allow_blank=True)
    description = serializers.CharField(required=False, allow_null=True, label='caption',
                                        style={'base_template': 'textarea.html'}, allow_blank=True)
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
        fields = ('url', 'id', 'name', 'description', 'overlay_type', 'tags', 'owner')

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    def get_owner(self, obj):
        return obj.owner.username


class GeometrySerializer(BaseNamedSerializer):
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        required=False,
        allow_null=True,
        style={'base_template': 'textarea.html'},
        source='point'
    )
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
            ('project_id', 'geometry')


class MediaGeometrySerializer(GeometrySerializer):
    file_name = serializers.CharField(source='file_name_new', required=False, read_only=True)
    caption = serializers.CharField(source='description', allow_null=True, required=False, allow_blank=True)

    class Meta:
        fields = GeometrySerializer.Meta.fields + ('attribution',
                                                   'file_name', 'caption')


class ExtentsSerializer(BaseNamedSerializer):
    project_id = fields.ProjectField(
        label='project_id',
        source='project',
        required=False)
    center = fields.GeometryField(
                        help_text='Assign a GeoJSON string',
                        required=False,
                        style={'base_template:input.html'},
                        #widget=widgets.JSONWidget,
                        #point_field_name='center'
                    )


class Meta:
    fields = BaseNamedSerializer.Meta.fields + ('project_id', 'center')
