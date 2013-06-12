#!/usr/bin/env python
from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q

class GenericLocalGroundError(Exception):
    
    def __init__(self, value):
        self.value = value
        
    def __str__(self):
        return repr(self.value)

class BaseMixin(object):
        
    def get_listing(self, user, filter=None, ordering_field=None):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.model.objects.distinct().select_related('owner', 'last_updated_by')
        #q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q
    
    def delete_by_ids(self, id_list, user):
        objects = []
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.model.objects.filter(id__in=id_list))
            for o in objects:
                #important:  delete does a cascading delete!
                #todo:  remove from file system too
                o.delete()
                num_deletes = num_deletes+1
                
        return '%s %s were deleted.' % (num_deletes, self.name_plural)

    def to_dict_list(self):
        return [p.to_dict() for p in self]

