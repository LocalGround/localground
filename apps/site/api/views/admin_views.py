from rest_framework import viewsets, permissions
from localground.apps.site.api import serializers
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from django.contrib.auth.models import User, Group

class TileViewSet(viewsets.ModelViewSet):
    queryset = models.WMSOverlay.objects.select_related(
        'overlay_type',
        'overlay_source').all()
    serializer_class = serializers.WMSOverlaySerializer
    filter_backends = (SQLFilterBackend,)
    permission_classes = (permissions.IsAdminUser,)

class OverlayTypeViewSet(viewsets.ModelViewSet):
    queryset = models.OverlayType.objects.all()
    serializer_class = serializers.OverlayTypeSerializer
    filter_backends = (SQLFilterBackend,)
    permission_classes = (permissions.IsAdminUser,)

class OverlaySourceViewSet(viewsets.ModelViewSet):
    queryset = models.OverlaySource.objects.all()
    serializer_class = serializers.OverlaySourceSerializer
    filter_backends = (SQLFilterBackend,)
    permission_classes = (permissions.IsAdminUser,)

class UserViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAdminUser,)

class GroupViewSet(viewsets.ModelViewSet):

    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = (permissions.IsAdminUser,)

class DataTypeViewSet(viewsets.ModelViewSet):
    queryset = models.DataType.objects.all().order_by('name',)
    serializer_class = serializers.DataTypeSerializer
    permission_classes = (permissions.IsAdminUser,)
