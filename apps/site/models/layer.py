#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import BaseAudit
from jsonfield import JSONField

class Layer(BaseAudit):
    styled_map = models.ForeignKey('StyledMap', related_name='%(class)s+')
    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    data_source = models.TextField(null=True, blank=True)
    group_by = models.CharField(max_length=64)
    metadata = JSONField(blank=True, null=True)
    symbols = JSONField(blank=True, null=True)

    def can_view(self, user, access_key=None):
        #all layer are viewable
        return True

    def can_edit(self, user):
        return self.styled_map.can_edit(user)

    class Meta:
        app_label = 'site'
        unique_together = ('title', 'styled_map')
