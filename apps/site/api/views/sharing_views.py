from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import QueryableRetrieveUpdateDestroyView
from rest_framework.permissions import IsAuthenticated

class SharingMixin(object):
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.SQLFilterBackend,)
    model = models.UserAuthorityObject
 
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        project = models.Project.objects.get(id=project_id)
        if project.can_edit(self.request.user):
            return models.UserAuthorityObject.objects.filter(
                object_id=self.kwargs.get('project_id'),
                content_type=models.Project.get_content_type()
            )
        else:
            raise exceptions.PermissionDenied(detail="You do not have editor or manager permissions on project id=%s" % project.id)

class SharingList(SharingMixin, generics.ListCreateAPIView):
    paginate_by = 100
    serializer_class = serializers.SharingListSerializer
    
    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = models.Project.objects.get(id=project_id)
        if project.can_manage(self.request.user):
            serializer.save(
                granted_by=self.request.user,
                object_id=project_id,
                content_type=models.Project.get_content_type()
            )
        else:
            raise exceptions.PermissionDenied(detail="You do not have manager permissions on project id=%s" % project.id)
            

class SharingInstance(SharingMixin, QueryableRetrieveUpdateDestroyView):
    serializer_class = serializers.SharingDetailSerializer
    
    def perform_update(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = models.Project.objects.get(id=project_id)
        if project.can_manage(self.request.user):
            serializer.save()
        else:
            raise exceptions.PermissionDenied(detail="You do not have manager permissions on project id=%s" % project.id)
