from django.contrib.gis.db import models
from localground.apps.site.managers import VideoManager
from django.contrib.postgres.fields import ArrayField
from localground.apps.site.models import BasePointMixin, BaseAudit, ProjectMixin
import os


class Video(ProjectMixin, BaseAudit, BasePointMixin, models.Model):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True, verbose_name="caption")
    tags = ArrayField(models.TextField(), default=list)
    video_id = models.CharField(null=False, blank=False, max_length=255)
    provider = models.CharField(max_length=63, null=False, blank=False, choices=VIDEO_PROVIDERS, verbose_name="video provider")

    def __str__(self):
        return self.name

    def __repr__(self):
        return self.name
