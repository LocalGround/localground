#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models import NamedMixin, ProjectMixin, BaseAudit
from jsonfield import JSONField
from localground.apps.site.managers import StyledMapManager

class StyledMap(NamedMixin, ProjectMixin, BaseAudit):
    center = models.PointField()
    zoom = models.IntegerField()
    panel_styles = JSONField(blank=True, null=True)
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", to be used as part of the url')
    basemap = models.ForeignKey(
        'TileSet',
        default=1)  # default to grayscale
    filter_fields = BaseAudit.filter_fields + ('slug', 'name', 'description', 'tags', 'owner', 'project')
    objects = StyledMapManager()

    def can_view(self, user, access_key=None):
        #all maps are viewable
        return True

    def __str__(self):
        # return '%s - %s' % self.id, self.name
        return self.name

    class Meta:
        app_label = 'site'
        verbose_name = 'styled_map'
        verbose_name_plural = 'styled_maps'
        unique_together = ('slug', 'owner')
