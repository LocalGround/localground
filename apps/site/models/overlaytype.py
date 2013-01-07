from django.contrib.gis.db import models

class OverlayType(models.Model):
    """
    Stores the kind of overlay (Base tileset versus data overlay)
    """
    name                = models.CharField(max_length=255, blank=True)
    description         = models.TextField(blank=True)
    def __unicode__(self):
        return self.name
    
    class Meta:
        app_label = 'site'