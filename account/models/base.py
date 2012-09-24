#!/usr/bin/env python
from django.contrib.gis.db import models
from datetime import datetime
from django.contrib.contenttypes import generic

class Base(models.Model):
    """
    Abstract base class for media files (for common core elements)
    """
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey('auth.User', db_column='user_id')
    time_stamp = models.DateTimeField(default=datetime.now, db_column='last_updated')

    class Meta:
        abstract = True
        app_label = "account"
        
    @property
    def model_name(self):
        return self._meta.verbose_name

    @property
    def model_name_plural(self):
        return self._meta.verbose_name_plural

class BasePermissions(Base):
    """
    Abstract base class for media groups (Project and View objects).
    """
    access_authority = models.ForeignKey('account.ObjectAuthority',
                            db_column='view_authority',
                            verbose_name='Sharing')
    access_key = models.CharField(max_length=16, null=True, blank=True)
    users = generic.GenericRelation('account.UserAuthorityObject')
    
    class Meta:
        abstract = True
        app_label = "account"

    
    


    