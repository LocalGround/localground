from rest_framework import serializers
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class VideoSerializer(BaseSerializer):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )
    geometry = fields.GeometryField(
        help_text='Assign a GeoJSON string',
        allow_null=True,
        required=False,
        style={'base_template': 'json.html', 'rows': 5},
        source='point'
    )

    project_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Project.objects.all(),
        source='project',
        required=True
    )

    caption = serializers.CharField(
        source='description', required=False, allow_null=True, label='caption',
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True)

    tags = fields.ListField(
        child=serializers.CharField(),
        required=False,
        allow_null=True,
        label='tags',
        style={'base_template': 'tags.html'},
        help_text='Tag your object here'
    )
    owner = serializers.SerializerMethodField()

    def get_owner(self, obj):
        return obj.owner.username

    overlay_type = serializers.SerializerMethodField()

    def get_overlay_type(self, obj):
        return obj._meta.verbose_name

    video_provider = serializers.ChoiceField(
        source='provider', choices=VIDEO_PROVIDERS, read_only=True)

    def get_video_provider_and_id(self, video_link):
        video_id = ''
        if 'youtube' in video_link:
            import re
            params = re.split(r'[&|\?]', video_link)
            for s in params:
                if 'v=' in s:
                    video_id = s.split('v=')[1]
                    break
            print params
            return {
                'provider': 'youtube',
                'video_id': video_id
            }
        elif 'vimeo' in video_link:
            return {
                'provider': 'vimeo',
                'video_id': video_link.split('.com/')[1]
            }
        else:
            raise Exception('this is neither youtube nor vimeo')

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        self.validated_data.update(self.get_presave_create_dictionary())
        self.validated_data.update({
            'attribution': validated_data.get('owner')
        })
        self.validated_data.update(self.get_video_provider_and_id(
            validated_data.get('video_link')
        ))
        self.instance = self.Meta.model.objects.create(**self.validated_data)
        return self.instance


    class Meta:
        model = models.Video
        read_only_fields = ('video_id', 'video_provider')
        fields = (
            'id', 'url', 'name', 'caption', 'tags', 'video_link',
            'video_id', 'video_provider', 'geometry', 'project_id',
            'owner', 'overlay_type', 'attribution')
