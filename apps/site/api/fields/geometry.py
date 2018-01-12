from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import OGRException
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import json


class GeometryField(serializers.CharField):

    """
    A field to handle GeoDjango Geometry fields
    """
    type_label = 'geojson'
    type_name = 'GeometryField'

    def get_attribute(self, obj):
        # We pass the object instance onto `to_representation`,
        # not just the field attribute.
        return obj

    def to_representation(self, obj):
        # raise Exception(self.source)
        geom = None
        # when source is nested (e.g. source='processed_image.extents'):
        if self.source.find(".") > 0:
            objects = self.source.split('.')
            parent = getattr(obj, objects[0])
            if parent:
                geom = getattr(parent, objects[1])
        else:  # when source is not nested
            geom = getattr(obj, self.source)
        #  overrides all other attributes.
        if hasattr(obj, 'geometry'):
            geom = obj.geometry
        if geom is not None:
            return json.loads(geom.geojson)
        return None

    def get_geosgeometry(self, value):
        if value is not None and value != '':
            try:
                return GEOSGeometry(value)
            except (ValueError, GEOSException, OGRException, TypeError) as e:
                raise serializers.ValidationError(
                    _('Invalid format: "{0} {1}"'.format(
                        value,
                        'unrecognized as WKT EWKT, and HEXEWKB.'))
                )

    def to_internal_value(self, value):
        return self.get_geosgeometry(value)
