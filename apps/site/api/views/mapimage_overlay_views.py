from rest_framework import generics
from localground.apps.site.api import serializers
from localground.apps.site import models


class MapImageOverlayList(generics.ListCreateAPIView):
    model = models.ImageOpts
    serializer_class = serializers.MapImageOverlayCreateSerializer

    def get_queryset(self):
        return self.model.objects.filter(
            source_mapimage__id=self.kwargs.get('map_id')
        )

    def perform_create(self, serializer):
        d = {
            'source_mapimage': models.MapImage.objects.get(
                id=self.kwargs.get('map_id')
            )
        }
        serializer.save(**d)


class MapImageOverlayInstance(generics.RetrieveUpdateDestroyAPIView):
    model = models.ImageOpts
    serializer_class = serializers.MapImageOverlayUpdateSerializer

    def get_queryset(self):
        return self.model.objects.filter(
            source_mapimage__id=self.kwargs.get('map_id')
        )
