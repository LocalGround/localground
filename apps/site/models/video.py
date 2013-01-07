from django.contrib.gis.db import models
from localground.apps.site.managers import VideoManager
from localground.apps.site.models import PointObject
from localground.apps.site.models.base import NamedUpload     
import os

class Video(PointObject, NamedUpload):
    source_scan         = models.ForeignKey('Scan', blank=True, null=True)
    source_marker       = models.ForeignKey('Marker', blank=True, null=True)
    path                = models.CharField(max_length=255)
    deleted             = models.BooleanField(default=False)
    objects             = VideoManager()
    
    def __unicode__(self):
        return self.path + ': ' + self.name
    
    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'video'
        verbose_name_plural = 'videos'