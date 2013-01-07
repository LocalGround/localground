#!/usr/bin/env python
from django.contrib.gis.db import models
from datetime import datetime

class Base(models.Model):
    """
    Abstract base class for media files (for common core elements).
    """
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey('auth.User', db_column='user_id')
    time_stamp = models.DateTimeField(default=datetime.now, db_column='last_updated')
    
    '''
    Who should inherit from this:
        * Groups:  Project, View, Marker, Scene
        * Media:  Photo, Audio, Video, Scan, Attachment
        * Print, Form
    
    Other fields
    
    last_updated_by = models.ForeignKey('auth.User', db_column='user_id')
    date_created = models.DateTimeField(default=datetime.now)
    '''

    class Meta:
        abstract = True
        app_label = "account"
        
    @property
    def model_name(self):
        return self._meta.verbose_name

    @property
    def model_name_plural(self):
        return self._meta.verbose_name_plural
