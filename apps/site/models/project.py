#!/usr/bin/env python
from django.contrib.gis.db import models
from localground.apps.site.models.permissions import ObjectPermissionsMixin
from localground.apps.site.models import BaseNamed, BaseGenericRelationMixin
from localground.apps.site.managers import ProjectManager


class Project(BaseNamed, BaseGenericRelationMixin, ObjectPermissionsMixin):
    extents = models.PolygonField(null=True, blank=True)
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", \
            to be used as part of the url')

    filter_fields = BaseNamed.filter_fields + (
        'slug', 'name', 'description', 'tags', 'owner'
    )
    objects = ProjectManager()

    class Meta:
        app_label = 'site'
        unique_together = ('slug', 'owner')
        verbose_name = 'project'
        verbose_name_plural = 'projects'

    @staticmethod
    def get_users():
        # Returns a list of user that own or have access to at least one
        # project.
        from django.db.models import Q
        from django.contrib.auth.models import User

        return User.objects.distinct().filter(
            Q(project__isnull=False) | Q(userauthorityobject__isnull=False)
        ).order_by('username', )

    @classmethod
    def get_default_project(self, user):
        from django.db.models import Q

        return Project.objects.filter(
            Q(owner=user) | Q(users__user=user)
        ).order_by('-time_stamp')[0]

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.name
