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
        if r.get('query'):
            query = QueryParser(queryset.model, r.get('query'))
            return query.extend_query(queryset)
        else:
            return queryset
