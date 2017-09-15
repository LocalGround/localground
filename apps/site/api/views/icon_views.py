from localground.apps.site.api.serializers import IconSerializerList, IconSerializerUpdate
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class IconList(MediaList):
    def get_queryset(self):
        project_id = self.kwargs.get('project_id') #comes from the url path
        return models.Icon.objects.filter(project__id=project_id)
    serializer_class = IconSerializerList
    model = models.Icon


class IconInstance(MediaInstance):
    serializer_class = IconSerializerUpdate
    model = models.Icon
