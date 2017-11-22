from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models


class MarkerWAttrsGeometryMixin(object):

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


class MarkerWAttrsList(QueryableListCreateAPIView, MarkerWAttrsGeometryMixin):
    filter_backends = (filters.SQLFilterBackend,)
    paginate_by = 100

    def get_serializer_class(self):
        r = self.request
        include_metadata = r.GET.get('include_metadata') in \
            ['True', 'true', '1']
        include_lists = r.GET.get('marker_with_media_arrays') in \
            ['True', 'true', '1']
        if include_metadata:
            if include_lists:
                return serializers.MarkerWAttrsSerializerListsWithMetadata
            else:
                return serializers.MarkerWAttrsSerializerCountsWithMetadata
        else:
            if include_lists:
                return serializers.MarkerWAttrsSerializerLists
            else:
                return serializers.MarkerWAttrsSerializerCounts

    def get_queryset(self):
        r = self.request
        include_lists = r.GET.get('marker_with_media_arrays') in \
            ['True', 'true', '1']
        if self.request.user.is_authenticated():
            if include_lists:
                return models.MarkerWithAttributes.objects \
                             .get_objects_with_lists(self.request.user)
            else:
                return models.MarkerWithAttributes.objects \
                             .get_objects_with_counts(self.request.user)
        else:
            if include_lists:
                return models.MarkerWithAttributes.objects \
                              .get_objects_public_with_lists(
                    access_key=self.request.GET.get('access_key')
                )
            else:
                return models.MarkerWithAttributes.objects \
                             .get_objects_public_with_counts(
                    access_key=self.request.GET.get('access_key')
                )

    def perform_create(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)


class MarkerWAttrsInstance(
        MarkerWAttrsGeometryMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = models.MarkerWithAttributes \
                     .objects.select_related('owner', 'project')
    serializer_class = serializers.MarkerWAttrsSerializer

    def perform_update(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)
