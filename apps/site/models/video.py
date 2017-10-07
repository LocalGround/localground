from django.contrib.gis.db import models
from localground.apps.site.managers import VideoManager
from django.contrib.postgres.fields import ArrayField
from localground.apps.site.models import PointMixin, BaseAudit, ProjectMixin
import os


class Video(ProjectMixin, BaseAudit, PointMixin, models.Model):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True, verbose_name="caption")
    tags = ArrayField(models.TextField(), default=list)
    video_id = models.CharField(null=False, blank=False, max_length=255)
    provider = models.CharField(max_length=63, null=False, blank=False,
                    choices=VIDEO_PROVIDERS, verbose_name="video provider")

    attribution = models.CharField(max_length=500, blank=True,
                                   null=True, verbose_name="Author / Creator",
                                   help_text="Name of the person / group who created the media file (text)")

    filter_fields = filter_fields = ('id', 'project', 'date_created', 'name', 'description', 'tags', 'point')
    objects = VideoManager()

    def __str__(self):
        return '{0}: {1} ({2}: {3})'.format(self.id, self.name, self.video_id, self.provider)

    def __repr__(self):
        return '{0}: {1} ({2}: {3})'.format(self.id, self.name, self.video_id, self.provider)

    def can_view(self, user, access_key=None):
        return self.project.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.project.can_edit(user)
