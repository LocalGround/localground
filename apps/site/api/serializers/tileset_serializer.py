from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields


class TileSetSerializer(AuditSerializerMixin, serializers.ModelSerializer):

    source_name = serializers.SerializerMethodField();
    base_tile_url = serializers.CharField(
        source='tile_url', required=False, allow_null=True, label='base_tile_url',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )
    base_static_url = serializers.CharField(
        source='static_url', required=False, allow_null=True, label='base_static_url',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )
    extras = fields.JSONField(style={'base_template': 'json.html', 'rows': 5}, required=False)
    
    class Meta:
        model = models.TileSet
        read_only_fields = ('owner', 'source_name')
        fields = ('id', 'url', 'name', 'tags', 'overlay_source', 'base_tile_url',
                  'base_static_url', 'min_zoom', 'source_name', 'max_zoom', 'is_printable',
                  'extras', 'key', 'owner')
        depth = 0
    
    def get_source_name(self, obj):
        return obj.overlay_source.name
    
