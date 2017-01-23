#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.groups import Group
from jsonfield import JSONField

class StyledMap(Group):
    center = models.PointField()
    zoom = models.IntegerField()
    panel_styles = JSONField(blank=True, null=True)
    
    class Meta:
        app_label = 'site'
        verbose_name = 'styled_map'
        verbose_name_plural = 'styled_maps'
        unique_together = ('slug', 'owner')