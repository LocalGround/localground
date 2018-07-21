from rest_framework import serializers
from localground.apps.site.api.serializers.base_serializer import \
    BaseSerializer, NamedSerializerMixin, ProjectSerializerMixin, \
    GeometrySerializerMixin
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
import re


class VideoSerializer(
        GeometrySerializerMixin, NamedSerializerMixin, ProjectSerializerMixin,
        BaseSerializer):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )

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
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            GeometrySerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + (
                'video_link', 'video_id', 'video_provider', 'attribution'
            )


class VideoUpdateSerializer(VideoSerializer):
    video_link = serializers.CharField(required=False)

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
        fields = BaseSerializer.field_list + \
            NamedSerializerMixin.field_list + \
            ProjectSerializerMixin.field_list + (
                'video_link', 'video_id', 'video_provider', 'geometry',
                'attribution'
            )
