from django.contrib.gis import admin as geoadmin
from django.contrib import admin
from models import WMSOverlay, OverlayType, OverlaySource, Marker

    
class WMSOverlayAdmin(geoadmin.GeoModelAdmin):
    save_on_top     = True

class MarkerAdmin(geoadmin.GeoModelAdmin):
    save_on_top     = True
    
admin.site.register(WMSOverlay, WMSOverlayAdmin)
admin.site.register(OverlayType)
admin.site.register(OverlaySource)
admin.site.register(Marker, MarkerAdmin)