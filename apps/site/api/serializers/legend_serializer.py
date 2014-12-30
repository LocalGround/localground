from localground.apps.site.api.serializers.base_serializer import BaseNamedSerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class LegendSerializer(BaseNamedSerializer):
    access = serializers.SerializerMethodField('get_access')
    legend_object = fields.JSONField(widget=widgets.JSONWidget, required=False)

    class Meta:
        model = models.Legend
        fields = BaseNamedSerializer.Meta.fields + \
            ('owner', 'slug', 'access', 'legend_object')
        depth = 0

    def get_access(self, obj):
        return obj.access_authority.name


class LegendDetailSerializer(LegendSerializer):

    class Meta:
        model = models.Legend
        fields = LegendSerializer.Meta.fields
        depth = 0
