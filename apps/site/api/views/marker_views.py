from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models

class MarkerGeometryMixin(object):
    
    def get_geometry_dictionary(self, serializer):
        geom = serializer.validated_data.get('point')
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
        
        # clear out existing geometries (marker can either be a point, polyline, or polygon),
        # but not more than one
        d = {
            'point': point,
            'polyline': polyline,
            'polygon': polygon
        }
        d.update(serializer.validated_data)
        return d

class MarkerList(QueryableListCreateAPIView, MarkerGeometryMixin, AuditCreate):
    serializer_class = serializers.MarkerSerializerCounts
    filter_backends = (filters.SQLFilterBackend,)

    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Marker.objects.get_objects_with_counts(
                self.request.user)
        else:
            return models.Marker.objects.get_objects_public_with_counts(
                access_key=self.request.GET.get('access_key')
            )

    def perform_create(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        d.update(self.get_presave_dictionary())
        serializer.save(**d)


class MarkerInstance(generics.RetrieveUpdateDestroyAPIView, MarkerGeometryMixin, AuditUpdate):
    queryset = models.Marker.objects.select_related('owner', 'project')
    serializer_class = serializers.MarkerSerializer

    def perform_update(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        d.update(self.get_presave_dictionary())
        serializer.save(**d)
        
