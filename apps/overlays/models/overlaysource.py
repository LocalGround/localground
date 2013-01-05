from django.contrib.gis.db import models

class OverlaySource(models.Model):
    """
    Stores the source of the overlay (Cloudmade, Google, Stamen, locally produced, etc.)
    """
    name                = models.CharField(max_length=255, blank=True)
    def __unicode__(self):
        return self.name
    
    class Meta:
        app_label = "overlays"