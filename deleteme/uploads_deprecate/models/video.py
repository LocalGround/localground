from django.contrib.gis.db import models
from localground.apps.uploads.managers import VideoManager
from localground.apps.site.lib.helpers.models import PointObject
from localground.apps.uploads.models import NamedUpload     

class Video(PointObject, NamedUpload):
    source_scan         = models.ForeignKey('uploads.Scan', blank=True, null=True)
    source_marker       = models.ForeignKey('overlays.Marker', blank=True, null=True)
    path                = models.CharField(max_length=255)
    deleted             = models.BooleanField(default=False)
    objects             = VideoManager()
    
    def __unicode__(self):
        return self.path + ': ' + self.name
    
    class Meta:
        app_label = "uploads"
        ordering = ['id']
        verbose_name = 'video'
        verbose_name_plural = 'videos'