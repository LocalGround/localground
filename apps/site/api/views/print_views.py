from rest_framework import viewsets, generics, permissions
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models


class PrintList(QueryableListCreateAPIView):
    serializer_class = serializers.PrintSerializer
    filter_backends = (filters.SQLFilterBackend, filters.RequiredProjectFilter)
    model = models.Print

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Print.objects.get_objects(self.request.user)
        else:
            return models.Print.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    paginate_by = 100


class PrintInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Print.objects.select_related(
        'project',
        'layout',
        'map_provider').all()
    serializer_class = serializers.PrintSerializerDetail


class LayoutViewSet(viewsets.ModelViewSet):
    queryset = models.Layout.objects.all()
    serializer_class = serializers.LayoutSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    filter_backends = (filters.SQLFilterBackend,)
