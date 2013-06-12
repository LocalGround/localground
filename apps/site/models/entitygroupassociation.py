from django.contrib.gis.db import models
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from localground.apps.site.models.base import BaseAudit

class EntityGroupAssociation(BaseAudit):
    """
    http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/
    Uses the contenttypes framework to create one big "meta-association table"
    between media elements (photos, audio files, scans, etc.) and groups.  See
    the reference above for more information about the contenttypes framework.
    """
    ordering = models.IntegerField()
    turned_on = models.BooleanField()
    
    #generic "Group" foreign key (Project, Marker, View, Scene, etc.):
    group_type = models.ForeignKey(ContentType)
    group_id = models.PositiveIntegerField()
    group_object = generic.GenericForeignKey('group_type', 'group_id')
    
    #generic "Entity" foreign key (Marker, Scan, Photo, Audio, Table Record.
    entity_type = models.ForeignKey(ContentType, related_name="%(app_label)s_%(class)s_related")
    entity_id = models.PositiveIntegerField()
    entity_object = generic.GenericForeignKey('entity_type', 'entity_id')
    
    def to_dict(self):
        return {
            'username': self.id,
            'ordering': self.ordering,
            'turned_on': self.turned_on
        }
    
    class Meta:
        app_label = 'site'
