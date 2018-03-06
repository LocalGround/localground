from rest_framework import serializers
from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
import re


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
        if video_link is None:
            return {}
        video_id = ''
        if 'youtube' in video_link:
            params = re.split(r'[&|\?]', video_link)
            for s in params:
                if 'v=' in s:
                    video_id = s.split('v=')[1]
                    break
            try:
                if len(video_id) == 11:
                    return {
                        'provider': 'youtube',
                        'video_id': video_id
                    }
                else:
                    raise serializers.ValidationError(
                        'Error parsing Youtube URL')
            except Exception:
                raise serializers.ValidationError('Error parsing Youtube URL')
        elif 'vimeo' in video_link:
            video_id = video_link.split('?')[0]
            video_id = video_id.split('/')[-1]
            try:
                if len(video_id) >= 7 and int(video_id):
                    return {
                        'provider': 'vimeo',
                        'video_id': video_id
                    }
                else:
                    raise serializers.ValidationError(
                        'Error parsing Vimeo URL')
            except Exception:
                raise serializers.ValidationError('Error parsing Vimeo URL')
        else:
            raise serializers.ValidationError(
                'This is neither YouTube nor Vimeo')

    def create(self, validated_data):
        # Overriding the create method to handle file processing
        self.validated_data.update(self.get_presave_create_dictionary())
        attribution = validated_data.get('attribution') \
            or validated_data.get('owner')
        self.validated_data.update({'attribution': attribution})
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


class VideoUpdateSerializer(VideoSerializer):
    project_id = serializers.SerializerMethodField()
    video_link = serializers.CharField(required=False)

    def get_project_id(self, obj):
        return obj.project.id

    def update(self, instance, validated_data):
        # Extend to add auditing information:
        validated_data.update(self.get_presave_update_dictionary())
        return super(AuditSerializerMixin, self).update(
            instance, validated_data)

    def update(self, instance, validated_data):
        # Recalculate the video provider and id if provided
        validated_data.update(self.get_presave_update_dictionary())
        validated_data.update(self.get_video_provider_and_id(
            validated_data.get('video_link')
        ))
        return super(VideoUpdateSerializer, self).update(
            instance, validated_data)

    class Meta:
        model = models.Video
        read_only_fields = ('video_id', 'video_provider')
        fields = (
            'id', 'url', 'name', 'caption', 'tags', 'video_link',
            'video_id', 'video_provider', 'geometry', 'project_id',
            'owner', 'overlay_type', 'attribution')
