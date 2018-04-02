from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models


class FormList(QueryableListCreateAPIView):
    serializer_class = serializers.DatasetSerializerList
    filter_backends = (filters.SQLFilterBackend, filters.RequiredProjectFilter)
    model = models.Form

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Form.objects.get_objects(self.request.user)
        else:
            raise exceptions.ParseError('Login Required')

    paginate_by = 100


class FormInstance(generics.RetrieveUpdateDestroyAPIView):
    model = models.form
    serializer_class = serializers.DatasetSerializerDetail

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Form.objects.get_objects(self.request.user)
        else:
            raise exceptions.ParseError('Login Required')
