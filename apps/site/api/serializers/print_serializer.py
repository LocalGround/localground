from localground.apps.site.api.serializers.base_serializer import ExtentsSerializer
from rest_framework import serializers
from localground.apps.site import models
from django.forms import widgets
from localground.apps.site.api import fields


class PrintSerializerMixin(serializers.ModelSerializer):
    
    uuid = serializers.SerializerMethodField()
    layout_url = serializers.HyperlinkedRelatedField(
        view_name='layout-detail',
        source='layout',
        read_only=True)
    layout = serializers.PrimaryKeyRelatedField(queryset=models.Layout.objects.all())
    map_provider_url = serializers.HyperlinkedRelatedField(
        view_name='tileset-detail',
        source='map_provider',
        read_only=True)
    map_provider = serializers.PrimaryKeyRelatedField(queryset=models.TileSet.objects.all())
    pdf = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()
    instructions = serializers.CharField(
        label='instructions',
        source='description',
        required=False,
        allow_blank=True,
        style={'base_template':'textarea.html','rows': 5}
    )
    map_title = serializers.CharField(
        label='map_title',
        source='name',
        required=False,
        allow_blank=True)
    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17)
    #edit_url = serializers.SerializerMethodField('get_configuration_url')
    overlay_type = serializers.SerializerMethodField()
    center = fields.GeometryField(
                help_text='Assign a GeoJSON center point',
                style={'base_template': 'json.html', 'rows': 5},
                required=True
            )
    
    def get_pdf(self, obj):
        return obj.pdf()

    def get_thumb(self, obj):
        return obj.thumb()

    def get_uuid(self, obj):
        return obj.uuid

    #def get_configuration_url(self, obj):
    #    return obj.configuration_url

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name
    
    
    
    class Meta:
        abstract = True
        fields = (
            'id',
            'uuid',
            'project_id',
            'map_title',
            'instructions',
            'tags',
            'pdf',
            'thumb',
            'zoom',
            'map_provider',
            'map_provider_url',
            'layout',
            'layout_url',
            'center',
            'overlay_type'
        )


class PrintSerializer(ExtentsSerializer, PrintSerializerMixin):

    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        read_only_fields = ('id', 'uuid')
        depth = 0


class PrintSerializerDetail(ExtentsSerializer, PrintSerializerMixin):
    center = fields.GeometryField(
                help_text='Assign a GeoJSON center point',
                style={'base_template': 'json.html', 'rows': 5},
                read_only=True
            )
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17, read_only=True)
    layout = serializers.SerializerMethodField()
    map_provider = serializers.SerializerMethodField()
    project_id = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Print
        fields = PrintSerializerMixin.Meta.fields
        depth = 0

    def get_map_provider(self, obj):
        return obj.map_provider.id

    def get_layout(self, obj):
        return obj.layout.id
    
    def get_project_id(self, obj):
        # Instance is read-only
        return obj.project.id

