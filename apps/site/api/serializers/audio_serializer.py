from localground.apps.site.api.serializers.base_serializer import \
    MediaGeometrySerializer, NamedSerializerMixin
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.lib.helpers import upload_helpers


class AudioSerializer(NamedSerializerMixin, MediaGeometrySerializer):
    file_path = serializers.SerializerMethodField()
    file_path_orig = serializers.SerializerMethodField()
    ext_whitelist = [
        'm4a', 'mp3', 'mp4', 'mpeg', '3gp', 'aif', 'aiff', 'ogg', 'wav'
    ]

    def get_file_path(self, obj):
        try:
            return obj.media_file.url
        except Exception:
            return None

    def get_file_path_orig(self, obj):
        try:
            return obj.media_file_orig.url
        except Exception:
            return None

    class Meta:
        model = models.Audio
        fields = NamedSerializerMixin.field_list + \
            MediaGeometrySerializer.field_list + \
            ('file_path', 'file_path_orig')
        depth = 0

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        owner = self.context.get('request').user
        f = self.initial_data.get('media_file')

        # ensure filetype is valid:
        upload_helpers.validate_file(f, self.ext_whitelist)

        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': validated_data.get('attribution') or owner.username
        })
        self.instance = self.Meta.model.objects.create(**self.validated_data)
        self.instance.process_file(f, name=self.validated_data.get('name'))
        return self.instance


class AudioSerializerUpdate(AudioSerializer):
    media_file = serializers.CharField(
        source='file_name_orig', required=False, read_only=True
    )
