from django.contrib.gis.db import models
from localground.apps.site.models.abstract.named import BaseNamed
from jsonfield import JSONField

class TileSet(BaseNamed):

    """
    Stores the specific overlays available in Local Ground.
    """
    min_zoom = models.IntegerField(default=1)
    max_zoom = models.IntegerField(default=20)
    overlay_source = models.ForeignKey('OverlaySource')
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
        #return user.is_superuser

    def can_manage(self, user):
        return True
        #return user.is_superuser

    def __unicode__(self):
        return '%s. %s (%s)' % (self.id, self.name, self.overlay_source.name)
