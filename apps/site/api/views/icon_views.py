from localground.apps.site.api.serializers import IconSerializerList, IconSerializerUpdate
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance


class IconList(MediaList):

    def get_queryset(self):
        from rest_framework.exceptions import APIException
        r = self.request.GET or self.request.POST
        project_id = r.get('project_id')
        if not project_id:
            raise APIException({
                'project_id': ['A project_id is required']
            })
        return models.Icon.objects.filter(project__id=project_id)

    serializer_class = IconSerializerList
    model = models.Icon


class IconInstance(MediaInstance):
    serializer_class = IconSerializerUpdate
    model = models.Icon
