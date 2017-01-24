from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.http import HttpResponse

class MapList(QueryableListCreateAPIView):
    error_messages = {}
    warnings = []
    serializer_class = serializers.MapSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.StyledMap
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return self.model.objects.get_objects(self.request.user)
        else:
            return self.model.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    '''def perform_create(self, serializer):
        d = {
            'access_authority': models.ObjectAuthority.objects.get(id=1)
        }
        serializer.save(**d)
    '''

    def create(self, request, *args, **kwargs):
        response = super(MapList, self).create(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response


class MapInstance(generics.RetrieveUpdateDestroyAPIView):
    error_messages = {}
    warnings = []
    queryset = models.StyledMap.objects.select_related('owner').all()
    serializer_class = serializers.MapDetailSerializer
    model = models.StyledMap

    def update(self, request, *args, **kwargs):
        response = super(MapInstance, self).update(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response
