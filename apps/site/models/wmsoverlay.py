from django.contrib.gis.db import models
from localground.apps.site.models.abstract.named import BaseNamed
from localground.apps.site.managers import WMSOverlayManager


class WMSOverlay(BaseNamed):

    """
    Stores the specific overlays available in Local Ground.
    """
    wms_url = models.CharField(max_length=500, blank=True)
    min_zoom = models.IntegerField(default=1)
    max_zoom = models.IntegerField(default=20)
    overlay_type = models.ForeignKey('OverlayType')
    overlay_source = models.ForeignKey('OverlaySource')
    extents = models.PolygonField(null=True, blank=True)
    auth_groups = models.ManyToManyField('auth.Group', blank=True)
    is_printable = models.BooleanField(default=False)
    provider_id = models.CharField(max_length=30, blank=True)
    objects = WMSOverlayManager()

    class Meta:
        verbose_name_plural = "Map Services (WMS Overlays)"
        app_label = 'site'
        verbose_name = 'tile'
        verbose_name_plural = 'tiles'
        ordering = ('id',)

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
        return '%s. %s' % (self.id, self.name)
