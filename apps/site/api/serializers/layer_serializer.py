from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class LayerSerializer(BaseNamedSerializer):
    access = serializers.SerializerMethodField('get_access')
    symbols = fields.JSONField(widget=widgets.JSONWidget, required=False)

    class Meta:
        model = models.Layer
        fields = BaseNamedSerializer.Meta.fields + \
            ('owner', 'slug', 'access', 'symbols')
        depth = 0

    def get_access(self, obj):
        return obj.access_authority.name


class LayerDetailSerializer(LayerSerializer):

    class Meta:
        model = models.Layer
        fields = LayerSerializer.Meta.fields
        depth = 0
