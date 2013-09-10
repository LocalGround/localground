from rest_framework import filters
from localground.apps.lib.helpers import QueryParser
from localground.apps.site import models
from django.db.models import Q
from django.template import RequestContext

class SQLFilterBackend(filters.BaseFilterBackend):
    """
    Filter that only allows users to see their own objects.
    """
    def filter_queryset(self, request, queryset, view):
        r = request.GET or request.POST
        queryset = self.__has_privileges(request.user, queryset)
        if r.get('query'):
            query = QueryParser(queryset.model, r.get('query'))
            return query.extend_query(queryset)
        else:
            return queryset
    
    
    def __has_privileges(self, user, q):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        if q.model.RESTRICT_BY_PROJECT:
            return q.filter(Q(project__owner=user) | Q(project__users__user=user))
        elif q.model.RESTRICT_BY_USER:
            return q.filter(Q(owner=user) | Q(users__user=user))
        elif q.model.RESTRICT_BY_PROJECTS:
            return q.filter(Q(projects__owner=user) | Q(projects__users__user=user))
        else:
            return q
        
    