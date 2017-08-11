from localground.apps.site.api.serializers import IconSerializerList, IconSerializerUpdate
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class IconList(MediaList):
    serializer_class = IconSerializerList
    model = models.Icon


class IconInstance(MediaInstance):
    serializer_class = IconSerializerUpdate
    model = models.Icon
