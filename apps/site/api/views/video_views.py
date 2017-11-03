from localground.apps.site.api.serializers import VideoSerializer
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import \
    MediaList, MediaInstance


class VideoList(MediaList):
    serializer_class = VideoSerializer
    model = models.Video


class VideoInstance(MediaInstance):
    serializer_class = VideoSerializer
    model = models.Video
