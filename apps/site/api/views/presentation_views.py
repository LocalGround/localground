from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import QueryableListCreateAPIView
from localground.apps.site import models


class PresentationList(QueryableListCreateAPIView):
    serializer_class = serializers.PresentationSerializer
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Presentation
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Presentation.objects.get_objects(self.request.user)
        else:
            return models.Presentation.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    def perform_create(self, serializer):
        d = {
            'access_authority': models.ObjectAuthority.objects.get(id=1)
        }
        serializer.save(**d)


class PresentationInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Presentation.objects.select_related('owner').all()
    serializer_class = serializers.PresentationSerializer
