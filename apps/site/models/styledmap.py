#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models import NamedMixin, ProjectMixin, BaseAudit
from jsonfield import JSONField
from localground.apps.site.managers import StyledMapManager
import json


class StyledMap(NamedMixin, ProjectMixin, BaseAudit):
    default_panel_styles = {
        'display_legend': True,
        'title': {
            'fw': 'bold',
            'color': '#ffffff',
            'backgroundColor': '#4e70d4',
            'font': 'Lato',
            'type': 'title',
            'size': '15'
        },
        'paragraph': {
            'fw': 'regular',
            'color': '#666',
            'backgroundColor': '#f0f1f5',
            'font': 'Lato',
            'type': 'paragraph',
            'size': '12'
        },
        'subtitle': {
            'fw': 'regular',
            'color': '#666',
            'backgroundColor': '#f7f7f7',
            'font': 'Lato',
            'type': 'subtitle',
            'size': '12'
        },
        'tags': {
            'fw': 'regular',
            'color': '#3d3d3d',
            'backgroundColor': '#f7f7f7',
            'font': 'Lato',
            'type': 'tags',
            'size': '10'
        }
    }
    center = models.PointField()
    zoom = models.IntegerField()
    panel_styles = JSONField(
        blank=False, null=False,
        default=json.dumps(default_panel_styles))
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='Unique url identifier')
    basemap = models.ForeignKey(
        'TileSet',
        default=1)  # default to grayscale
    filter_fields = BaseAudit.filter_fields + \
        ('slug', 'name', 'description', 'tags', 'owner', 'project')
    objects = StyledMapManager()

    def can_view(self, user, access_key=None):
        # all maps are viewable
        return True

    def __str__(self):
        # return '%s - %s' % self.id, self.name
        return self.name

    class Meta:
        app_label = 'site'
        verbose_name = 'styled_map'
        verbose_name_plural = 'styled_maps'
        unique_together = ('slug', 'owner')
