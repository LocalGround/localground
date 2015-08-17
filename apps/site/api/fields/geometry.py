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
        geom = getattr(obj, self.source)
        if hasattr(obj, 'geometry'):
            geom = obj.geometry
        if geom is not None:
            return json.loads(geom.geojson)  
        return None
        
    def get_geosgeometry(self, value):
        if value is not None and value != '':
            if isinstance(value, dict):
                value = json.dumps(value)
            
            try:
                return GEOSGeometry(value)
            except (ValueError, GEOSException, OGRException, TypeError) as e:
                raise serializers.ValidationError(
                    _('Invalid format: "{0}" unrecognized as WKT EWKT, and HEXEWKB.'.format(value))
                )
    
    def to_internal_value(self, value):
        return self.get_geosgeometry(value)
        '''
        if geom is None:
            #if we can't null out the field, then do nothing:
            if not self.nullable:
                return None
        '''


