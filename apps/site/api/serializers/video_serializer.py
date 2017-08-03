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
        style={'base_template': 'textarea.html', 'rows': 5}, allow_blank=True
    )    

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
        source='provider', choices=VIDEO_PROVIDERS,)

    class Meta:
        model = models.Video
        fields = ('id', 'url', 'name', 'caption', 'tags', 'video_id', 'video_provider', 'geometry', 'project_id', 'owner', 'overlay_type', 'attribution')
