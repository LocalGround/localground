from localground.apps.site.api.serializers.base_serializer \
    import AuditSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.lib.helpers import upload_helpers


class MapImageOverlayUpdateSerializer(
        AuditSerializerMixin, serializers.ModelSerializer):
    file_path = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        read_only=False,
        style={'base_template': 'json.html'},
        source='extents'
    )

    def get_url(self, obj):
        model_name_plural = models.MapImage.model_name_plural
        return '%s/api/0/%s/%s/overlays/%s/' % (
            settings.SERVER_URL,
            model_name_plural,
            obj.source_mapimage.id,
            obj.id
        )

    def get_file_path(self, obj):
        return obj.encrypt_url(obj.file_name_orig)

    class Meta:
        model = models.ImageOpts
        read_only_fields = ('file_path', 'file_name_orig')
        fields = (
            'id', 'url', 'geometry', 'file_path', 'file_name_orig',
            'opacity', 'name')
        depth = 0


class MapImageOverlayCreateSerializer(MapImageOverlayUpdateSerializer):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    media_file = serializers.CharField(
        source='file_name_orig', required=True,
        style={'base_template': 'file.html'},
        help_text='Valid file types are: ' + ', '.join(ext_whitelist)
    )

    class Meta:
        model = models.ImageOpts
        read_only_fields = ('file_path', 'file_name_orig')
        fields = (
            'id', 'url', 'geometry', 'file_path', 'file_name_orig',
            'media_file', 'opacity', 'name')
        depth = 0

    def create(self, validated_data):
        validated_data.update(self.get_presave_create_dictionary())

        # 1. save file blob to disk:
        f = self.initial_data.get('media_file')
        upload_helpers.validate_file(f, self.ext_whitelist)
        mapimage = validated_data.get('source_mapimage')
        owner = self.context.get('request').user
        model_name_plural = models.MapImage.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(
            owner, model_name_plural, f, uuid=mapimage.uuid)

        # 2. include new path variables in save dictionary:
        validated_data.update({
            'file_name_orig': file_name_new,
            'host': mapimage.host,
            'virtual_path': mapimage.virtual_path
        })

        # 3. call default "create" method:
        return self.Meta.model.objects.create(**validated_data)
