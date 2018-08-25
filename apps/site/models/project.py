#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.abstract.mixins import ObjectPermissionsMixin
from localground.apps.site.models import NamedMixin, \
    GenericRelationMixin, BaseAudit
from localground.apps.site.managers import ProjectManager


class Project(NamedMixin, GenericRelationMixin,
              ObjectPermissionsMixin, BaseAudit):
    extents = models.PolygonField(null=True, blank=True)
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", '
                  'to be used as part of the url'
    )

    filter_fields = BaseAudit.filter_fields + (
        'slug', 'name', 'description', 'tags'
    )
    objects = ProjectManager()

    class Meta:
        app_label = 'site'
        # unique_together = ('slug', 'owner')
        verbose_name = 'project'
        verbose_name_plural = 'projects'
