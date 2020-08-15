from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views \
    import QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from localground.apps.site.api.permissions import \
    CheckProjectPermissions, CheckUserCanPostToProject


class MapList(QueryableListCreateAPIView):
    error_messages = {}
    warnings = []

    def get_serializer_class(self):
        method = self.get_serializer_context().get('request').method
        if method == 'GET':
            return serializers.MapSerializerList
        else:
            return serializers.MapSerializerPost

    filter_backends = (filters.SQLFilterBackend, filters.RequiredProjectFilter)
    permission_classes = (CheckProjectPermissions, CheckUserCanPostToProject)
    model = models.StyledMap
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return self.model.objects.get_objects(self.request.user)
        else:
            return self.model.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

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
    serializer_class = serializers.MapSerializerDetail
    model = models.StyledMap

    def update(self, request, *args, **kwargs):
        response = super(MapInstance, self).update(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response


class MapInstanceSlug(MapInstance):
    serializer_class = serializers.MapSerializerDetailSlug
    lookup_field = 'slug'
