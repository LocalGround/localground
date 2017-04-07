from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin
from rest_framework import serializers
from localground.apps.site import models

class TileSetSerializer(AuditSerializerMixin, serializers.ModelSerializer):

    base_tile_url = serializers.CharField(
        source='tile_url', required=False, allow_null=True, label='base_tile_url',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )
    base_static_url = serializers.CharField(
        source='static_url', required=False, allow_null=True, label='base_static_url',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )
    class Meta:
        model = models.TileSet
        read_only_fields = ('owner',)
        fields = ('id', 'url', 'name', 'tags', 'overlay_source', 'base_tile_url',
                  'base_static_url', 'min_zoom', 'max_zoom', 'is_printable', 'owner')
        depth = 0
