from rest_framework import serializers
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site import models, widgets
from localground.apps.site.api import fields


class VideoSerializer(serializers.Serializer):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )
    '''
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(
        required=False, allow_blank=True, max_length=255)
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
    video_id = serializers.CharField(
        required=True, allow_blank=False, max_length=255)
    video_provider = serializers.ChoiceField(
        source='provider', choices=VIDEO_PROVIDERS,)
'''
    class Meta:
        model = models.Video
        fields = ('id', 'name', 'description', 'tags', 'video_id', 'provider')


    def create(self, validated_data):
        """
        Create and return a new `Snippet` instance, given the validated data.
        """
        return models.Video.objects.create(**validated_data)

    '''   def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.code = validated_data.get('code', instance.code)
        instance.linenos = validated_data.get('linenos', instance.linenos)
        instance.language = validated_data.get('language', instance.language)
        instance.style = validated_data.get('style', instance.style)
        instance.save()
        return instance
    '''
