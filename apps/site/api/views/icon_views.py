from localground.apps.site.api.serializers import IconSerializer
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class IconList(MediaList):
    serializer_class = IconSerializer
    model = models.Icon


class IconInstance(MediaInstance):
    serializer_class = IconSerializer
    model = models.Icon
