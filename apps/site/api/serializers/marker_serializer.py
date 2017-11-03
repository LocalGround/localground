from localground.apps.site.api.serializers.base_serializer import GeometrySerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.site.api.metadata import CustomMetadata

class MarkerSerializerMixin(GeometrySerializer):
    #color = fields.ColorField(required=False)
    color = serializers.CharField(required=False, allow_null=True, label='name', allow_blank=True)
    update_metadata = serializers.SerializerMethodField()


    class Meta:
        model = models.Marker
        fields = GeometrySerializer.Meta.fields + ('color', 'extras')
        depth = 0

    def get_update_metadata(self, obj):
        m = CustomMetadata()
        return m.get_serializer_info(self)

class MarkerSerializer(MarkerSerializerMixin):

    def __init__(self, *args, **kwargs):
        super(MarkerSerializer, self).__init__(*args, **kwargs)

    children = serializers.SerializerMethodField()
    photo_count = serializers.SerializerMethodField()
    audio_count = serializers.SerializerMethodField()
    video_count = serializers.SerializerMethodField()
    map_image_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Marker
        fields = MarkerSerializerMixin.Meta.fields + \
            ('children', 'photo_count', 'audio_count', 'video_count', 'map_image_count')
        depth = 0

    def get_children(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        candidates = [
            models.Photo,
            models.Audio,
            models.Video,
            models.MapImage,
            models.Project,
            models.Marker]

        # this caches the ContentTypes so that we don't keep executing one-off
        # queries
        ContentType.objects.get_for_models(*candidates, concrete_model=False)
        children = {}
        self.audio = self.get_audio(obj) or []
        self.photos = self.get_photos(obj) or []
        self.videos = self.get_videos(obj) or []
        self.map_images = self.get_map_images(obj) or []
        if self.audio:
            children['audio'] = self.audio
        if self.photos:
            children['photos'] = self.photos
        if self.videos:
            children['videos'] = self.videos
        if self.map_images:
            children['map_images'] = self.map_images

        return children

    def get_photos(self, obj):
        from localground.apps.site.api.serializers import PhotoSerializer

        data = PhotoSerializer(
            obj.photos,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.Photo, data)

    def get_videos(self, obj):
        from localground.apps.site.api.serializers import VideoSerializer

        data = VideoSerializer(
            obj.videos,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.Video, data)

    def get_audio(self, obj):
        from localground.apps.site.api.serializers import AudioSerializer

        data = AudioSerializer(
            obj.audio,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.Audio, data)

    def get_map_images(self, obj):
        from localground.apps.site.api.serializers import MapImageSerializerUpdate

        data = MapImageSerializerUpdate(
            obj.map_images,
            many=True, context={ 'request': {} }).data
        return self.serialize_list(obj, models.MapImage, data)

    def get_photo_count(self, obj):
        return len(obj.photos)

    def get_audio_count(self, obj):
        return len(obj.audio)

    def get_video_count(self, obj):
        return len(obj.videos)

    def get_map_image_count(self, obj):
        return len(obj.map_images)

    def serialize_list(self, obj, cls, data, name=None, overlay_type=None,
                       model_name_plural=None):
        if data is None or len(data) == 0:
            return None
        if name is None:
            name = cls.model_name_plural.title()
        if overlay_type is None:
            overlay_type = cls.model_name
        if model_name_plural is None:
            model_name_plural = cls.model_name_plural
        return {
            'id': model_name_plural,
            'name': name,
            'overlay_type': overlay_type,
            'data': data,
            'attach_url': '%s/api/0/markers/%s/%s/' %
            (settings.SERVER_URL,
             obj.id,
             model_name_plural)}

class MarkerSerializerCounts(MarkerSerializerMixin):
    photo_count = serializers.SerializerMethodField()
    audio_count = serializers.SerializerMethodField()
    video_count = serializers.SerializerMethodField()
    map_image_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Marker
        fields = MarkerSerializerMixin.Meta.fields + \
            ('photo_count', 'audio_count', 'video_count', 'map_image_count')
        depth = 0

    def get_photo_count(self, obj):
        try:
            return obj.photo_count
        except:
            return None

    def get_audio_count(self, obj):
        try:
            return obj.audio_count
        except:
            return None

    def get_video_count(self, obj):
        try:
            return obj.video_count
        except:
            return None

    def get_map_image_count(self, obj):
        try:
            return obj.map_image_count
        except:
            return None

class MarkerSerializerCountsWithMetadata(MarkerSerializerCounts):
    class Meta:
        model = models.Marker
        fields = MarkerSerializerCounts.Meta.fields + ('update_metadata', )
        depth = 0

class MarkerSerializerLists(MarkerSerializerMixin):
    photo_array = serializers.SerializerMethodField()
    audio_array = serializers.SerializerMethodField()
    video_array = serializers.SerializerMethodField()
    map_image_array = serializers.SerializerMethodField()

    class Meta:
        model = models.Marker
        fields = MarkerSerializerMixin.Meta.fields + \
            ('photo_array', 'audio_array', 'video_array', 'map_image_array')
        depth = 0

    def get_photo_array(self, obj):
        try:
            return obj.photo_array
        except:
            return None

    def get_audio_array(self, obj):
        try:
            return obj.audio_array
        except:
            return None

    def get_video_array(self, obj):
        try:
            return obj.video_array
        except:
            return None

    def get_map_image_array(self, obj):
        try:
            return obj.map_image_array
        except:
            return None

class MarkerSerializerListsWithMetadata(MarkerSerializerLists):
    class Meta:
        model = models.Marker
        fields = MarkerSerializerLists.Meta.fields + ('update_metadata', )
        depth = 0
