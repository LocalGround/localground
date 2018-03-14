from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class LayerSerializer(BaseSerializer):
    symbols = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5}, required=False)
    metadata = fields.JSONField(
        style={'base_template': 'json.html', 'rows': 5}, required=False)
    map_id = serializers.SerializerMethodField()

    def get_map_id(self, obj):
        return obj.styled_map.id

    def create(self, validated_data):
        map_id = self.context.get('view').kwargs.get('map_id')
        validated_data.update({
            'styled_map_id': map_id
        })
        validated_data.update(self.get_presave_create_dictionary())
        self.instance = self.Meta.model.objects.create(**validated_data)
        return self.instance

    class Meta:
        model = models.Layer
        fields = BaseSerializer.Meta.fields + (
            'title', 'data_source', 'group_by', 'metadata', 'map_id', 'symbols'
        )
        depth = 0


class LayerDetailSerializer(LayerSerializer):

    def update(self, instance, validated_data):
        map_id = self.context.get('view').kwargs.get('map_id')
        validated_data.update({
            'styled_map_id': map_id
        })
        return super(LayerDetailSerializer, self).update(
            instance, validated_data)

    class Meta:
        model = models.Layer
        fields = LayerSerializer.Meta.fields
        depth = 0
