from django.contrib.gis.db import models
from localground.apps.site.managers import VideoManager
from localground.apps.site.models import ExtrasMixin, BasePointMixin, BaseUploadedMedia
import os


class Video(ExtrasMixin, BasePointMixin, BaseUploadedMedia):
    name = 'video'
    name_plural = 'videos'
    objects = VideoManager()

    def __unicode__(self):
        return self.path + ': ' + self.name

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'video'
        verbose_name_plural = 'videos'
