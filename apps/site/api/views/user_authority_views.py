from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site import models


class UserAuthorityList(generics.ListCreateAPIView):
    serializer_class = serializers.UserAuthorityObjectSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.UserAuthorityObject
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            project_id = self.kwargs['project_id']
            return models.UserAuthorityObject.objects.filter(object_id=project_id, content_type=models.Project.get_content_type())

    def perform_create(self, serializer):
        d = {'granted_by': self.request.user, 'object': models.Project.objects.get(id=self.kwargs['project_id'])}
        serializer.save(**d)

''' Dont think we need this
class UserAuthorityInstance(generics.ListCreateAPIView):
    serializer_class = serializers.UserAuthorityObjectSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated():
            project_id = self.request.query_params.get('project_id', None)
            return models.UserAuthorityObject.objects.filter(object_id=project_id)
'''