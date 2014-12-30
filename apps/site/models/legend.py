#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models import BaseNamed
from localground.apps.site.models.permissions import BasePermissions
from jsonfield import JSONField
from localground.apps.site.managers import LegendManager

class Legend(BaseNamed, BasePermissions):
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", to be used as part of the url')
    
    legend_object = JSONField()
    objects = LegendManager()
    
    class Meta:
        app_label = 'site'
        unique_together = ('slug', 'owner')