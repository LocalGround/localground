from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base


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
