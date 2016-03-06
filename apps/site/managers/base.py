#!/usr/bin/env python
from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.lib.errors import GenericLocalGroundError


class BaseMixin(object):
    related_fields = ['owner', 'last_updated_by']

    def _apply_sql_filter(self, queryset, request, context):
        if context.get('has_filters') is not None:
            return queryset
        if request is None or request.GET.get('query') is None:
            return queryset

        from localground.apps.lib.helpers import QueryParser
        query = QueryParser(self.model, request.GET.get('query'))
        if query.error:
            context.update({'error_message': query.error_message})
            return queryset

        # Add some information to the request context
        context.update({
            'filter_fields': query.populate_filter_fields(),
            'sql': query.query_text,
            'has_filters': True
        })
        return query.extend_query(queryset)

    def get_objects(
            self,
            user,
            request=None,
            context=None,
            ordering_field='name'):
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
        #q = self._apply_sql_filter(q, request, context)

        if ordering_field:
            q = q.order_by(ordering_field)
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
                # important:  delete does a cascading delete!
                o.delete()
                num_deletes = num_deletes + 1

        return '%s %s were deleted.' % (num_deletes, self.get_model_name())

    def to_dict_list(self):
        return [p.to_dict() for p in self]


class ObjectMixin(BaseMixin):
    related_fields = ['project', 'owner', 'last_updated_by']
    prefetch_fields = []

    def _get_objects(self, user, authority_id, project=None, request=None,
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
        q = (
            self.model.objects
            .select_related(*self.related_fields)
                .filter(
                    Q(authuser__user=user) &
                    Q(authuser__user_authority__id__gte=authority_id)
            ))
        if project:
            q = q.filter(project=project)
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q

    def get_objects(self, user, project=None, request=None,
                    context=None, ordering_field='-id'):
        return self._get_objects(
            user, 1, project=project, request=request,
            context=context, ordering_field=ordering_field
        )

    def get_objects_editable(self, user, project=None, request=None,
                             context=None, ordering_field='-time_stamp'):
        return self._get_objects(
            user, 2, project=project, request=request,
            context=context, ordering_field=ordering_field
        )

    def get_objects_public(self, access_key=None, request=None, context=None,
                           ordering_field='-time_stamp', **kwargs):
        '''
        Returns all objects that belong to a project that has been
        marked as public
        '''
        from localground.apps.site.models import ObjectAuthority
        #q = self.model.objects.distinct().select_related(*self.related_fields)
        q = self.model.objects.select_related(*self.related_fields)
        q = q.filter(
            (Q(
                project__access_authority__id=ObjectAuthority.PUBLIC_WITH_LINK) & Q(
                project__access_key=access_key)) | Q(
                project__access_authority__id=ObjectAuthority.PUBLIC))
        if request is not None:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q


class GroupMixin(ObjectMixin):
    related_fields = [
        'owner',
        'last_updated_by',
        'access_authority',]
        #'tag',
        #'tags']
    #prefetch_fields = ['users__user']
    prefetch_fields = []

    def _get_objects(self, user, authority_id, request=None, context=None,
                     ordering_field='-time_stamp', with_counts=True, **kwargs):
        raise NotImplementedError("Subclasses must implement this method")

    def get_objects(self, user, project=None, request=None,
                    context=None, ordering_field='-time_stamp'):
        return self._get_objects(
            user, 1, project=project, request=request,
            context=context, ordering_field=ordering_field
        )

    def get_objects_editable(self, user, project=None, request=None,
                             context=None, ordering_field='-time_stamp'):
        return self._get_objects(
            user, 2, project=project, request=request,
            context=context, ordering_field=ordering_field
        )

    def get_objects_public(self, access_key=None, request=None, context=None,
                           ordering_field='-time_stamp', **kwargs):
        '''
        Returns all objects that belong to a project that has been
        marked as public
        '''
        from localground.apps.site.models import ObjectAuthority
        #q = self.model.objects.distinct().select_related(*self.related_fields)
        q = self.model.objects.select_related(*self.related_fields)
        q = q.filter(
            Q(access_authority__id=ObjectAuthority.PUBLIC) | (
                Q(access_authority__id=ObjectAuthority.PUBLIC_WITH_LINK)
                &
                Q(access_key=access_key)
            )
        )
        if request is not None:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q
