from rest_framework import filters
from django.conf import settings
from localground.apps.lib.helpers import QueryParser
from localground.apps.site import models
from django.db.models import Q
from django.template import RequestContext
from rest_framework.exceptions import APIException


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


class RequiredProjectFilter(filters.BaseFilterBackend):

    """
    Filter that only allows users to see their own objects.
    """

    def filter_queryset(self, request, queryset, view):
        r = request.GET or request.POST
        if not r.get('project_id'):
            project_ids = [
                str(p.id) for p in models.Project.objects.get_objects(
                    request.user).order_by('id',)
            ]

            message = 'A project_id parameter is required.'
            message += ' For example: {0}{1}?project_id={2}.'.format(
                settings.SERVER_URL,
                request.get_full_path().split('?')[0],
                project_ids[0]
            )
            message += ' Valid project_ids for username "{0}" are: {1}'.format(
                request.user.username,
                ', '.join(project_ids)
            )
            raise APIException(message)
        else:
            query = queryset.filter(project__id=r.get('project_id'))
            return query
