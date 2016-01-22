from localground.apps.site.api import serializers, filters
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class AudioList(MediaList):
    serializer_class = serializers.AudioSerializer
    model = models.Audio


class AudioInstance(MediaInstance):
    serializer_class = serializers.AudioSerializerUpdate
    model = models.Audio
