from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from localground.apps.lib.helpers import get_timestamp_no_milliseconds


class ProjectList(QueryableListCreateAPIView):
    serializer_class = serializers.ProjectSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Project
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Project.objects.get_objects(self.request.user)
        else:
            return models.Project.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )
    
    def perform_create(self, serializer):
        if serializer.validated_data.get("access_authority") == None:
            d = {'access_authority': models.ObjectAuthority.objects.get(id=1)}
            serializer.save(**d)
        else:
            serializer.save()


class ProjectInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Project.objects.select_related('owner').all()
    serializer_class = serializers.ProjectDetailSerializer



