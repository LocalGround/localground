from django.contrib.gis.db import models
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from localground.apps.site.models import BaseAudit

class GenericAssociation(BaseAudit):
    """
    http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/
    Uses the contenttypes framework to create one big "meta-association table"
    between media elements (photos, audio files, scans, etc.) and groups.  See
    the reference above for more information about the contenttypes framework.
    """
    ordering = models.IntegerField()
    turned_on = models.BooleanField()
    
    # analogous to the "subject" in a triplet,
    # (e.g. "The 'source' has an 'entity.'")
    source_type = models.ForeignKey(ContentType)
    source_id = models.PositiveIntegerField()
    source_object = generic.GenericForeignKey('source_type', 'source_id')
    
    # analogous to the "object" in a triplet
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
        unique_together = ('source_type', 'source_id', 'entity_type', 'entity_id')
