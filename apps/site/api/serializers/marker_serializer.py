from localground.apps.site.api.serializers.base_serializer import \
    GeometrySerializer
from rest_framework import serializers
from localground.apps.site import models, widgets
from localground.apps.site.api import fields
from django.conf import settings
from localground.apps.site.api.metadata import CustomMetadata


class MarkerSerializer(GeometrySerializer):
    #update_metadata = serializers.SerializerMethodField()
    attached_photos_ids = serializers.SerializerMethodField()
    attached_audio_ids = serializers.SerializerMethodField()
    attached_videos_ids = serializers.SerializerMethodField()
    attached_map_images_id = serializers.SerializerMethodField()

    class Meta:
        model = models.Record
        fields = GeometrySerializer.Meta.fields + (
            'extras', 'attached_photos_ids',
            'attached_audio_ids', 'attached_videos_ids',
            'attached_map_images_id'
        )
        depth = 0

    # def get_update_metadata(self, obj):
    #     m = CustomMetadata()
    #     return m.get_serializer_info(self)

    def get_attached_photos_ids(self, obj):
        try:
            return obj.photo_array
        except Exception:
            return None

    def get_attached_audio_ids(self, obj):
        try:
            return obj.audio_array
        except Exception:
            return None

    def get_attached_videos_ids(self, obj):
        try:
            return obj.video_array
        except Exception:
            return None

    def get_attached_map_images_id(self, obj):
        try:
            return obj.map_image_array
        except Exception:
            return None


class MarkerSerializerDetail(MarkerSerializer):

    def __init__(self, *args, **kwargs):
        super(MarkerSerializer, self).__init__(*args, **kwargs)

    children = serializers.SerializerMethodField()

    class Meta:
        model = models.Record
        fields = MarkerSerializer.Meta.fields + ('children', )
        depth = 0

    def get_children(self, obj):
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

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
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Photo, data)

    def get_videos(self, obj):
        from localground.apps.site.api.serializers import VideoSerializer

        data = VideoSerializer(
            obj.videos,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Video, data)

    def get_audio(self, obj):
        from localground.apps.site.api.serializers import AudioSerializer

        data = AudioSerializer(
            obj.audio,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.Audio, data)

    def get_map_images(self, obj):
        from localground.apps.site.api.serializers import \
            MapImageSerializerUpdate

        data = MapImageSerializerUpdate(
            obj.map_images,
            many=True, context={'request': {}}).data
        return self.serialize_list(obj, models.MapImage, data)

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
            'attach_url': '%s/api/0/markers/%s/%s/' % (
                settings.SERVER_URL, obj.id, model_name_plural)
         }
