#!/usr/bin/env python
from django.contrib.gis.db import models
from datetime import datetime, timedelta
from localground.apps.site.models.abstract.named import BaseNamed
from django.conf import settings
import os, stat
import base64
    

class BaseGenericRelations(BaseNamed):
    from django.contrib.contenttypes import generic
    
    entities = generic.GenericRelation('EntityGroupAssociation',
                                       content_type_field='group_type',
                                       object_id_field='group_id',
                                       related_name="%(app_label)s_%(class)s_related")
    
    class Meta:
        app_label = 'site'
        abstract = True
        
    def append(self, item, user, ordering=-1, turned_on=False):
        '''
        Appends a photo, audio, or data record object to a marker or view
        '''
        from localground.apps.site.models import EntityGroupAssociation
        
        if not issubclass(item.__class__, BaseUploadedMedia):
            raise Exception('Only items of type Photo, Audio, or Record can be appended.')
        
        assoc = EntityGroupAssociation(
            group_type=self.get_content_type(),
            group_id=self.id,
            entity_type=item.get_content_type(),
            entity_id=item.id,
            ordering=ordering,
            turned_on=turned_on,
            owner=user,
            last_updated_by=user,
            date_created=datetime.now(),
            time_stamp=datetime.now()
        )
        assoc.save()    
       
        
    def _get_filtered_entities(self, cls):
        """
        Private method that queries the EntityGroupAssociation model for
        references to the current view for a given media type (Photo,
        Audio, Video, Scan, Marker).
        """
        qs = (self.entities
                .filter(entity_type=cls.get_content_type())
                .prefetch_related('entity_object', 'entity_object__owner')
                .order_by('ordering',))
        entities = []
        for rec in list(qs):
            o = rec.entity_object
            o.ordering = rec.ordering
            o.turned_on = rec.turned_on
            entities.append(o)
        return entities
    
    @property
    def photos(self):
        from localground.apps.site.models.photo import Photo
        return self._get_filtered_entities(Photo)    
    
    @property
    def audio(self):
        from localground.apps.site.models.audio import Audio
        return self._get_filtered_entities(Audio)
    
    @property
    def videos(self):
        from localground.apps.site.models.video import Video
        return self._get_filtered_entities(Video)
    
    @property
    def map_images(self):
        from localground.apps.site.models.scan import Scan
        return self._get_filtered_entities(Scan)
        
    @property
    def markers(self):
        from localground.apps.site.models.marker import Marker
        return self._get_filtered_entities(Marker)
        
    

