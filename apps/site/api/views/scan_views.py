from localground.apps.site.api import serializers
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class ScanList(MediaList):
    ext_whitelist = ['jpg', 'jpeg', 'gif', 'png']
    serializer_class = serializers.ScanSerializerCreate
    model = models.Scan


class ScanInstance(MediaInstance):
    serializer_class = serializers.ScanSerializerUpdate
    model = models.Scan
