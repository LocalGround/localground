from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models


class MarkerGeometryMixin(object):

    def get_geometry_dictionary(self, serializer):
        d = {}
        geom = serializer.validated_data.get('point')
        if geom:
            del serializer.validated_data['point']
        point, polyline, polygon = None, None, None
        if geom is not None:
            if geom.geom_type == 'Point':
                point = geom
            elif geom.geom_type == 'LineString':
                polyline = geom
            elif geom.geom_type == 'Polygon':
                polygon = geom
            else:
                raise serializers.ValidationError('Unsupported geometry type')

            # clear out existing geometries (marker can either be a
            # point, polyline, or polygon), but not more than one
            d = {
                'point': point,
                'polyline': polyline,
                'polygon': polygon
            }
        d.update(serializer.validated_data)
        return d


class MarkerList(QueryableListCreateAPIView, MarkerGeometryMixin):
    filter_backends = (filters.SQLFilterBackend, filters.RequiredProjectFilter)
    paginate_by = 100
    serializers_class = serializers.MarkerSerializerListsWithMetadata

    def get_serializer_class(self):
        return serializers.MarkerSerializerListsWithMetadata

    def get_queryset(self):
        from rest_framework.exceptions import APIException
        r = self.request.GET or self.request.POST
        if not r.get('project_id'):
            raise APIException({
                'project_id': ['A project_id is required']
            })
        return models.Marker.objects.get_objects_with_lists(
            project=models.Project.objects.get(
                id=int(r.get('project_id')))
        )

    def perform_create(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)


class MarkerInstance(
        MarkerGeometryMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Marker.objects.select_related('owner', 'project')
    serializer_class = serializers.MarkerSerializer

    def perform_update(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)
