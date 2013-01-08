from django.contrib.gis.db import models
from datetime import datetime    
from localground.apps.site.managers import WMSOverlayManager
from localground.apps.site.models.base_new import BaseNamed, BaseAudit
    
class WMSOverlay(BaseNamed):
    name = 'tile'
    name_plural = 'tiles'
    """
    Stores the specific overlays available in Local Ground.
    """
    wms_url             = models.CharField(max_length=500, blank=True)
    min_zoom            = models.IntegerField(default=1)
    max_zoom            = models.IntegerField(default=20)
    overlay_type        = models.ForeignKey('OverlayType')
    overlay_source      = models.ForeignKey('OverlaySource')
    extents             = models.PolygonField(null=True, blank=True)
    auth_groups         = models.ManyToManyField('auth.Group', null=True)
    is_printable        = models.BooleanField(default=False)
    provider_id         = models.CharField(max_length=30, blank=True)
    objects             = WMSOverlayManager()

    class Meta:
        verbose_name_plural = "Map Services (WMS Overlays)"
        app_label = 'site'
        
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