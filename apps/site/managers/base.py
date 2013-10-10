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
    related_fields = ['owner', 'last_updated_by']
    
    def _apply_sql_filter(self, queryset, request, context):
        if request is None or request.GET.get('query') is None:
            return queryset
        
        from localground.apps.lib.helpers import QueryParser
        f = QueryParser(self.model, request.GET.get('query'))
        if f.error:
            context.update({'error_message': query.error_message})
            return queryset
        
        # Add some information to the request context
        context.update({
            'filter_fields': f.populate_filter_fields(),
            'sql': f.query_text,
            'has_filters': True
        })
        return f.extend_query(queryset)    
    
    def get_objects(self, user, request=None, context=None, ordering_field='name'):
        '''
        Returns objects to which the logged in user has view permissions
        '''
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')    
        q = (self.model.objects
             .distinct()
             .select_related(*self.related_fields)
             .filter(owner=user)
            )
        q = self._apply_sql_filter(q, request, context)
            
        if ordering_field:
            q =  q.order_by(ordering_field)
        return q
    
    def get_objects_editable(self, request=None, context=None,
                             ordering_field='name'):
        return self.get_objects(
            request=request,
            context=context,
            ordering_field=ordering_field
        )
    
    def get_objects_manageable(self, request=None, context=None,
                               ordering_field='name'):
        return self.get_objects(
            request=request,
            context=context,
            ordering_field=ordering_field
        )
    
    def delete_by_ids(self, id_list, user):
        objects = []
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.model.objects.filter(id__in=id_list))
            for o in objects:
                #important:  delete does a cascading delete!
                o.delete()
                num_deletes = num_deletes+1
                
        return '%s %s were deleted.' % (num_deletes, self.get_model_name())
        
    def to_dict_list(self):
        return [p.to_dict() for p in self]


class ObjectMixin(BaseMixin):
    related_fields = ['project', 'owner', 'last_updated_by']
    prefetch_fields = []
    
    def get_objects(self, user, project=None, request=None,
                             context=None, ordering_field='-time_stamp'):
        '''
        Returns:
        (1) all objects that the user owns, as well as
        (2) objects that belong to a project to which the user has been
            granted permissions
        '''
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        if not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be anonymous')
        q = (self.model.objects.distinct()
                .select_related(*self.related_fields)
                .filter(Q(project__owner=user) | Q(project__users__user=user))
            )
        if project:
            q = q.filter(project=project)
        
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q =  q.order_by(ordering_field)
        return q
    
    def get_objects_editable(self, user, project=None, request=None,
                             context=None, ordering_field='name'):
        '''
        Returns:
        (1) all objects that the user owns, as well as
        (2) objects that belong to a project to which the user has been
            granted editor or manager permissions
        '''
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        if not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be anonymous')
        
        q = (self.model.objects.distinct()
                .select_related(*self.related_fields)
                .filter(
                    Q(project__owner=user) | (
                        Q(project__users__user=user) &
                        Q(project__users__authority__id__gte=2)
                    )
                )
            )
        if project:
            q = q.filter(project=project)
        if request:
            q = self._apply_sql_filter(q, request, context)
        if ordering_field:
            q =  q.order_by(ordering_field)
        return q
    
    def get_objects_public(self, project=None, request=None, context=None,
                           ordering_field='name'):
        '''
        Returns all objects that belong to a project that has been
        marked as public
        '''
        q = (self.model.objects.distinct()
                .select_related(*self.related_fields)
                .filter(Q(project__access_authority__id=3))
            )
        if project:
            q = q.filter(project=project)
        if request:
            q = self._apply_sql_filter(q, request)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q =  q.order_by(ordering_field)
        return q
    
class GroupMixin(ObjectMixin):
    related_fields = ['owner', 'last_updated_by', 'tags']
    prefetch_fields = ['users__user']
    
    def get_objects(self, user, request=None, context=None,
                    ordering_field='-time_stamp', with_counts=True, **kwargs):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        
        q = self.model.objects.distinct().select_related(*self.related_fields)
        q = q.filter(Q(owner=user) | Q(users__user=user))
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q =  q.order_by(ordering_field)
        '''
        #This query works, but it's so slow!
        if with_counts:
            from django.db.models import Count
            q = q.annotate(processed_maps_count=Count('scan', distinct=True))
            q = q.annotate(photo_count=Count('photo', distinct=True))
            q = q.annotate(audio_count=Count('audio', distinct=True))
            q = q.annotate(marker_count=Count('marker', distinct=True))
        '''
        return q
    
    '''
    def apply_filter(self, user, query=None, order_by='id'):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.get_objects(user)
        if query is not None:
            q = query.extend_query(q)
        if order_by is not None:
            q = q.order_by(order_by)
        return q
    '''
   