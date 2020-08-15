from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import BaseAudit, Base
from localground.apps.site.models.abstract.mixins import NamedMixin
from jsonfield import JSONField
'''
This file contains the following classes:
* OverlaySource
* OverlayType
* TileSet
'''


class OverlaySource(Base):
    """
    Stores the source of the overlay
    (MapBox, Google, Stamen, locally produced, etc.)
    """
    name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return self.name

    class Meta:
        app_label = 'site'
        verbose_name = 'overlay-source'
        verbose_name_plural = 'overlay-sources'


class OverlayType(Base):
    FILTER_BY_OWNER = False
    name = models.CharField(max_length=255, blank=True, editable=False)
    description = models.TextField(blank=True, editable=False)

    class Meta:
        app_label = 'site'
        verbose_name = 'overlay-type'
        verbose_name_plural = 'overlay-types'

    def __unicode__(self):
        return self.name


class TileSet(NamedMixin, BaseAudit):

    """
    Stores the specific overlays available in Local Ground.
    """
    min_zoom = models.IntegerField(default=1)
    max_zoom = models.IntegerField(default=20)
    overlay_source = models.ForeignKey('OverlaySource', on_delete=models.PROTECT)
    is_printable = models.BooleanField(default=False)
    provider_id = models.CharField(max_length=30, blank=True)
    tile_url = models.CharField(max_length=2000, blank=True)
    static_url = models.CharField(max_length=2000, blank=True)
    key = models.CharField(max_length=512, blank=True, null=True)
    attribution = models.CharField(max_length=1000, blank=True, null=True)
    extras = JSONField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Map Services (WMS Overlays)"
        app_label = 'site'
        verbose_name = 'tile'
        verbose_name_plural = 'tiles'
        ordering = ('id',)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'source_id': self.overlay_source.id,
            'source_name': self.overlay_source.name,
            'tile_url': self.tile_url,
            'static_url': self.static_url,
            'min': self.min_zoom,
            'max': self.max_zoom,
            'is_printable': self.is_printable
        }

    def can_view(self, user, access_key=None):
        return True

    def can_edit(self, user):
        return True

    def can_manage(self, user):
        return True

    def __unicode__(self):
        return '%s. %s (%s)' % (self.id, self.name, self.overlay_source.name)
