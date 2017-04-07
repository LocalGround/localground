from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models
from django.http import HttpResponse

class TileSetList(QueryableListCreateAPIView):
    error_messages = {}
    warnings = []
    serializer_class = serializers.TileSetSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.TileSet
    paginate_by = 100
        
    def get_queryset(self):
        return self.model.objects.all()

    def create(self, request, *args, **kwargs):
        response = super(TileSetList, self).create(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response


class TileSetInstance(generics.RetrieveUpdateDestroyAPIView):
    error_messages = {}
    warnings = []
    def get_queryset(self):
        return self.model.objects.all()
    
    serializer_class = serializers.TileSetSerializer
    model = models.TileSet

    def update(self, request, *args, **kwargs):
        response = super(TileSetInstance, self).update(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response
