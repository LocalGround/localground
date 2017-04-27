from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.site.api.serializers.layer_serializer import LayerSerializer


class MapSerializer(BaseNamedSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='map-detail',)
    sharing_url = serializers.SerializerMethodField()
    center = fields.GeometryField(
                help_text='Assign a GeoJSON string',
                required=True,
                style={'base_template': 'json.html', 'rows': 5}
            )
    panel_styles = fields.JSONField(style={'base_template': 'json.html', 'rows': 5},
                               required=False)
    basemap = serializers.PrimaryKeyRelatedField(queryset=models.TileSet.objects.all())
    zoom = serializers.IntegerField(min_value=1, max_value=20, default=17)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=False
    )
    
    def get_fields(self, *args, **kwargs):
        fields = super(MapSerializer, self).get_fields(*args, **kwargs)
        #restrict project list at runtime:
        fields['project_id'].queryset = self.get_projects()
        return fields

    class Meta:
        model = models.StyledMap
        fields = BaseNamedSerializer.Meta.fields + \
            ('slug', 'sharing_url', 'center', 'basemap', 'zoom', 'panel_styles', 'project_id')
        depth = 0

    def get_sharing_url(self, obj):
        return obj.slug


class MapDetailSerializer(MapSerializer):
    layers = serializers.SerializerMethodField()
    layers_url = serializers.SerializerMethodField()
    
    class Meta:
        model = models.StyledMap
        fields = MapSerializer.Meta.fields + ('layers', 'layers_url')
        depth = 0
        
    def get_layers(self, obj):
        layers = models.Layer.objects.filter(styled_map=obj)
        return LayerSerializer( layers, many=True, context={ 'request': {} }).data
    
    def get_layers_url(self, obj):
        return '%s/api/0/maps/%s/layers/' % (settings.SERVER_URL, obj.id)
    
class MapDetailSerializerSlug(MapDetailSerializer):
    extra_kwargs = {
        'url': {'lookup_field': 'slug'}
    }
