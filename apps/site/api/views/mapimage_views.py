from localground.apps.site.api import serializers
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class MapImageList(MediaList):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    serializer_class = serializers.MapImageSerializerCreate
    model = models.MapImage


class MapImageInstance(MediaInstance):
    serializer_class = serializers.MapImageSerializerUpdate
    model = models.MapImage
