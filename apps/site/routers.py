from swampdragon import route_handler
from swampdragon.route_handler import ModelRouter
from localground.apps.site.api.realtime_serializers import PhotoRTSerializer
from localground.apps.site.models import Photo


class PhotoRouter(ModelRouter):
    route_name = 'photo'
    serializer_class = PhotoRTSerializer
    model = Photo

    def get_object(self, **kwargs):
        return self.model.objects.get(pk=kwargs['id'])

    def get_query_set(self, **kwargs):
        return self.model.objects.all()

route_handler.register(PhotoRouter)