from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base
from localground.apps.site.lib.helpers import get_timestamp_no_milliseconds
from datetime import datetime    
from localground.apps.site.managers import WMSOverlayManager
from tagging_autocomplete.models import TagAutocompleteField 
    
class WMSOverlay(Base):
    """
    Stores the specific overlays available in Local Ground.
    Not using model inheritance here b/c I want owner field to have
    optional null values.
    """
    owner = models.ForeignKey('auth.User', null=True)
    last_updated_by = models.ForeignKey('auth.User', null=True, related_name="%(app_label)s_%(class)s_related")
    date_created = models.DateTimeField(default=get_timestamp_no_milliseconds)
    time_stamp = models.DateTimeField(default=get_timestamp_no_milliseconds,
                                                    db_column='last_updated')
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = TagAutocompleteField(blank=True, null=True)
    wms_url = models.CharField(max_length=500, blank=True)
    min_zoom = models.IntegerField(default=1)
    max_zoom = models.IntegerField(default=20)
    overlay_type = models.ForeignKey('OverlayType')
    overlay_source = models.ForeignKey('OverlaySource')
    extents = models.PolygonField(null=True, blank=True)
    auth_groups = models.ManyToManyField('auth.Group', null=True)
    is_printable = models.BooleanField(default=False)
    provider_id = models.CharField(max_length=30, blank=True)
    objects = WMSOverlayManager()

    class Meta:
        verbose_name_plural = "Map Services (WMS Overlays)"
        app_label = 'site'
        verbose_name = 'tile'
        verbose_name_plural = 'tiles'
        
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