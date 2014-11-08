from rest_framework import serializers
from django.contrib.gis.geos import GEOSGeometry, GEOSException
from django.contrib.gis.gdal import OGRException
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
import json

class TablePhotoField(serializers.WritableField):
    
    def to_native(self, obj):
        return {
            'name': obj.name,
            'id': obj.id,
            'file_name_medium_sm': obj.encrypt_url(obj.file_name_medium_sm)
        }
    
class TableAudioField(serializers.WritableField):
    
    def to_native(self, obj):
        return {
            'name': obj.name,
            'id': obj.id,
            'file_path': obj.encrypt_url(obj.file_name_new) 
        }
    
    
   