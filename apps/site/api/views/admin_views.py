from rest_framework import viewsets, permissions
from localground.apps.site.api import serializers
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from django.contrib.auth.models import User, Group
from rest_framework.views import APIView
from rest_framework.response import Response

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

class ListUsernames(APIView):
    from localground.apps.site.api.renderers import BrowsableAPIRenderer
    from rest_framework.renderers import JSONRenderer
    from rest_framework_jsonp.renderers import JSONPRenderer
    from rest_framework_xml.renderers import XMLRenderer
    renderer_classes = (
        BrowsableAPIRenderer,
        JSONRenderer,
        JSONPRenderer,
        XMLRenderer
    )
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request, format=None):
        keyword = request.query_params.get('q')
        users = User.objects.all()
        if keyword:
            users = User.objects.filter(username__contains=keyword)
        usernames = [user.username for user in users]
        return Response(usernames)

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
