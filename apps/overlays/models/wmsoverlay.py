from django.contrib.gis.db import models
from datetime import datetime    
from localground.apps.overlays.managers import WMSOverlayManager
    
class WMSOverlay(models.Model):
    """
    Stores the specific overlays available in Local Ground.
    """
    name                = models.CharField(max_length=255, blank=True)
    description         = models.TextField(blank=True)
    wms_url             = models.CharField(max_length=500, blank=True)
    time_stamp          = models.DateTimeField(default=datetime.now, blank=True)
    min_zoom            = models.IntegerField(default=1)
    max_zoom            = models.IntegerField(default=20)
    overlay_type        = models.ForeignKey('overlays.OverlayType')
    overlay_source      = models.ForeignKey('overlays.OverlaySource')
    extents             = models.PolygonField(null=True, blank=True)
    auth_groups         = models.ManyToManyField('auth.Group', null=True)
    is_printable        = models.BooleanField(default=False)
    provider_id         = models.CharField(max_length=30, blank=True)
    user                = models.ForeignKey('auth.User', null=True)
    objects             = WMSOverlayManager()

    class Meta:
        verbose_name_plural = "Map Services (WMS Overlays)"
        app_label = "overlays"
        
    def to_dict(self):
        return {
            'id': self.id,
            'typeID': self.overlay_type.id,
            'name': self.name,
            'sourceID': self.overlay_source.id,
            'sourceName': self.overlay_source.name,
            'type': self.overlay_type.name,
            'url': self.wms_url,
            'providerID': self.provider_id,
            'min': self.min_zoom, 
            'max': self.max_zoom,
            'is_printable': self.is_printable
        }
    
    def __unicode__(self):
        return self.name