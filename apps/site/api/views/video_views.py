from rest_framework import generics
from localground.apps.site.api.serializers import VideoSerializer
from localground.apps.site import models


class VideoList(generics.ListCreateAPIView):
    queryset = models.Video.objects.all()
    serializer_class = VideoSerializer


class VideoInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Video.objects.all()
    serializer_class = VideoSerializer
