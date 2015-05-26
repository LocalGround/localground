from rest_framework import serializers
from localground.apps.site import widgets, models
from localground.apps.site.api import fields
from django.forms.widgets import Input


class BaseSerializer(serializers.HyperlinkedModelSerializer):

    def __init__(self, *args, **kwargs):
        super(BaseSerializer, self).__init__(*args, **kwargs)
        # if not hasattr(self.Meta, 'extra_kwargs'):
        #     self.Meta.extra_kwargs = dict()
        # if 'view_name' not in self.Meta.extra_kwargs.keys():
        #     # method of the DRF's serializers.HyperlinkedModelSerializer class:
        #     self.opts.view_name = self._get_default_view_name(self.opts.model)

        #raise Exception('%s - %s' % (self.opts.view_name, self.opts.lookup_field))

        model_meta = self.Meta.model._meta
        format_kwargs = {
            'app_label': model_meta.app_label,
            'model_name': model_meta.object_name.lower()
        }

        '''
        url_field = fields.UrlField(
            view_name='%(model_name)s-detail'.format(format_kwargs), #self.opts.view_name,
            lookup_field='pk'#self.opts.lookup_field
        )
        #url_field.initialize(self, 'url')
        self.fields['url'] = url_field
        '''

        # Extra Sneaky:  give access to the request object in the
        # HyperlinkedSerializer so that child objects can also use
        # it:
        #self.request = url_field.context.get('request', None)
    class Meta:
        fields = ('id',)


class BaseNamedSerializer(serializers.HyperlinkedModelSerializer):
    tags = serializers.CharField(required=False, allow_null=True, label='tags',
                                    help_text='Tag your object here')
    name = serializers.CharField(required=False, allow_null=True, label='name')
    description = serializers.CharField(required=False, allow_null=True, label='caption',
                                        style={'base_template': 'textarea.html'})
    overlay_type = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        '''
        Overriding HyperlinkedModelSerializer constructor to use a
        slightly altered version of the HyperlinkedIdentityField class
        that takes some query params into account.
        '''
        super(BaseNamedSerializer, self).__init__(*args, **kwargs)

    class Meta:
        fields = ('url', 'id', 'name', 'description', 'overlay_type', 'tags', 'owner')

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    def get_owner(self, obj):
        return obj.owner.username


class GeometrySerializer(BaseNamedSerializer):
    '''
    geometry = fields.GeometryField(help_text='Assign a GeoJSON string',
                                    required=False,
                                    #widget=widgets.JSONWidget)
                                    style={'base_template:input.html'})
    '''
    #project_id = fields.ProjectField(source='project', required=False)

    class Meta:
        fields = BaseNamedSerializer.Meta.fields + \
            ('project', 'geometry')


class MediaGeometrySerializer(GeometrySerializer):
    file_name = serializers.Field(source='file_name_new')
    caption = serializers.Field(source='description')

    class Meta:
        fields = GeometrySerializer.Meta.fields + ('attribution',
                                                   'file_name', 'caption')


class ExtentsSerializer(BaseNamedSerializer):
    project_id = fields.ProjectField(
        label='project_id',
        source='project',
        required=False)
    center = fields.GeometryField(help_text='Assign a GeoJSON string',
                                  required=False,
                                  style={'base_template:input.html'},
                                  #widget=widgets.JSONWidget,
                                  point_field_name='center')


class Meta:
    fields = BaseNamedSerializer.Meta.fields + ('project_id', 'center')
