from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework.response import Response


class LayerList(QueryableListCreateAPIView):
    error_messages = {}
    warnings = []
    serializer_class = serializers.LayerSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Layer
    paginate_by = 100

    def get_map(self):
        map_id = int(self.kwargs.get('map_id'))
        styled_map = None
        try:
            styled_map = models.StyledMap.objects.get(id=map_id)
        except models.StyledMap.DoesNotExist:
            raise Http404
        return styled_map

    def get_queryset(self):
        return self.model.objects.filter(styled_map=self.get_map())

    def create(self, request, *args, **kwargs):
        response = super(LayerList, self).create(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response


class LayerInstance(
        generics.RetrieveUpdateDestroyAPIView):
    error_messages = {}
    warnings = []

    def get_queryset(self):
        map_id = int(self.kwargs.get('map_id'))
        try:
            styled_map = models.StyledMap.objects.get(id=map_id)
        except models.StyledMap.DoesNotExist:
            raise Http404
        return self.model.objects.filter(styled_map=styled_map)

    serializer_class = serializers.LayerDetailSerializer
    model = models.Layer

    def update(self, request, *args, **kwargs):
        response = super(LayerInstance, self).update(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response
