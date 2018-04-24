from rest_framework import generics, exceptions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models


class DatasetList(QueryableListCreateAPIView):
    serializer_class = serializers.DatasetSerializerList
    filter_backends = (filters.SQLFilterBackend, filters.RequiredProjectFilter)
    model = models.Dataset

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Dataset.objects.get_objects(self.request.user)
        else:
            raise exceptions.ParseError('Login Required')

    paginate_by = 100


class DatasetInstance(generics.RetrieveUpdateDestroyAPIView):
    model = models.dataset
    serializer_class = serializers.DatasetSerializerDetail

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Dataset.objects.get_objects(self.request.user)
        else:
            raise exceptions.ParseError('Login Required')

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
        except Exception as e:
            raise exceptions.ValidationError(str(e))
        return Response(status=status.HTTP_204_NO_CONTENT)
