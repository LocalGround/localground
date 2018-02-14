from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.serializers.marker_w_attrs_serializer import \
    create_dynamic_serializer
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404

class MarkerWAttrsGeometryMixin(object):

    def get_serializer_class(self, is_list=False):
        '''
        This serializer class gets build dynamically, according to the
        user-generated table being queried
        '''
        try:
            #form = models.Form.objects.get(id=1)
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
        except models.Form.DoesNotExist:
            raise Http404
        return create_dynamic_serializer(form)

    def get_geometry_dictionary(self, serializer):
        geom = serializer.validated_data.get('point')

        # If method is PATCH and geom is None, don't clear out
        # existing geometry:
        if self.request.method == 'PATCH' and geom is None:
            return serializer.validated_data

        # Otherwise, overwrite:
        d = {}
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

    def get_queryset(self):
        #raise Exception(dir(self.request))
        return models.Record.objects \
                             .get_objects_with_lists(self.kwargs.get('form_id'))


class MarkerWAttrsList(MarkerWAttrsGeometryMixin, QueryableListCreateAPIView):
    filter_backends = (filters.SQLFilterBackend,)
    paginate_by = 100

    '''def get_serializer_class(self, is_list=False):
        try:
            form = models.Form.objects.get(id=1)
        except models.Form.DoesNotExist:
            raise Http404
        return create_dynamic_serializer(form)
    '''


    def perform_create(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)


class MarkerWAttrsInstance(
        MarkerWAttrsGeometryMixin, generics.RetrieveUpdateDestroyAPIView):

    def perform_update(self, serializer):
        d = self.get_geometry_dictionary(serializer)
        serializer.save(**d)
