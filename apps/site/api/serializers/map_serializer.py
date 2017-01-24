from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class MapSerializer(BaseNamedSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='map-detail',)
    sharing_url = serializers.SerializerMethodField()
    center = fields.GeometryField(
                help_text='Assign a GeoJSON string',
                required=True,
                style={'base_template': 'json.html', 'rows': 5}
            )
    basemap = serializers.PrimaryKeyRelatedField(queryset=models.WMSOverlay.objects.all())
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
            ('slug', 'sharing_url', 'center', 'basemap', 'zoom', 'project_id')
        depth = 0

    def get_sharing_url(self, obj):
        return obj.slug


class MapDetailSerializer(MapSerializer):

    class Meta:
        model = models.StyledMap
        fields = MapSerializer.Meta.fields
        depth = 0
