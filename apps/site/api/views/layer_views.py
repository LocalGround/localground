from rest_framework import generics, status
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models
from rest_framework.response import Response


class LayerList(QueryableListCreateAPIView):
    error_messages = {}
    warnings = []
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Layer
    paginate_by = 100

    def get_serializer_class(self):
        method = self.get_serializer_context().get('request').method
        if method == 'GET':
            return serializers.LayerSerializer
        else:
            return serializers.LayerSerializerPost

    def get_map(self):
        map_id = int(self.kwargs.get('map_id'))
        styled_map = None
        try:
            styled_map = models.StyledMap.objects.get(id=map_id)
        except models.StyledMap.DoesNotExist:
            raise Http404
        return styled_map

    def get_queryset(self):
        return self.model.objects.filter(styled_map=self.get_map())

    # Override so that POST response can use a different serializer
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # return using different serializer:
        return Response(
            serializers.LayerSerializer(
                serializer.instance, context={'request': {}}).data,
            status=status.HTTP_201_CREATED, headers=headers
        )


class LayerInstance(
        generics.RetrieveUpdateDestroyAPIView):
    error_messages = {}
    warnings = []

    def get_queryset(self):
        map_id = int(self.kwargs.get('map_id'))
        try:
            styled_map = models.StyledMap.objects.get(id=map_id)
        except models.StyledMap.DoesNotExist:
            raise Http404
        return self.model.objects.filter(styled_map=styled_map)

    serializer_class = serializers.LayerDetailSerializer
    model = models.Layer

    def update(self, request, *args, **kwargs):
        response = super(LayerInstance, self).update(request, *args, **kwargs)
        if len(self.warnings) > 0:
            response.data.update({'warnings': self.warnings})
        if self.error_messages:
            response.data = self.error_messages
            response.status = status.HTTP_400_BAD_REQUEST
        return response
