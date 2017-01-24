from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class LayerSerializer(BaseSerializer):
    symbols = fields.JSONField(style={'base_template': 'json.html', 'rows': 5},
                               required=False)
    filters = fields.JSONField(style={'base_template': 'json.html', 'rows': 5},
                               required=False)
    map_id = serializers.PrimaryKeyRelatedField(
        queryset=models.StyledMap.objects.all(),
        source='styled_map',
        required=True
    )
    class Meta:
        model = models.Layer
        fields = BaseSerializer.Meta.fields + \
            ('title', 'data_property', 'symbol_shape',
             'layer_type', 'filters', 'map_id', 'owner', 'symbols')
        depth = 0


class LayerDetailSerializer(LayerSerializer):
    #url = serializers.HyperlinkedIdentityField(view_name='layer-detail',)
    class Meta:
        model = models.Layer
        fields = LayerSerializer.Meta.fields
        depth = 0
