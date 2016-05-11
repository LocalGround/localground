from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from localground.apps.site.managers.base import GroupMixin
from localground.apps.site.managers.base import GenericLocalGroundError
from django.db.models import Q


class ProjectMixin(GroupMixin):
    prefetch_fields = []

    def _get_objects(self, user, authority_id=1, request=None, context=None,
                     ordering_field='-time_stamp', with_counts=True, **kwargs):

        if user is None or not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be empty')

        q = (
            self.model.objects
            .select_related(*self.related_fields)
            .filter(
                Q(authuser__user=user) &
                Q(authuser__user_authority__id__gte=authority_id)
            )
        )
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if with_counts:
            sql = 'SELECT count(id) from site_{0} WHERE site_{0}.project_id = site_project.id'
            q = q.extra(
                select={
                    'photo_count': sql.format('photo'),
                    'audio_count': sql.format('audio'),
                    'processed_maps_count': sql.format('mapimage'),
                    'marker_count': sql.format('marker'),
                    'shared_with': 'select shared_with from v_projects_shared_with WHERE v_projects_shared_with.id = site_project.id'
                },
            )
        if ordering_field:
            q = q.order_by(ordering_field)
        return q  # self.populate_tags_for_queryset(q)
    

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the ProjectSerializer in the API?
        return []


class ProjectQuerySet(QuerySet, ProjectMixin):
    pass


class ProjectManager(models.GeoManager, ProjectMixin):
    
    def get_queryset(self):
        return ProjectQuerySet(self.model, using=self._db)


class SnapshotMixin(GroupMixin):

    def _get_objects(self, user, authority_id=1, request=None, context=None,
                     ordering_field='-time_stamp', with_counts=True, **kwargs):

        if user is None or not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be empty')

        q = (
            self.model.objects
            .select_related(*self.related_fields)
            .filter(
                Q(authuser__user=user) &
                Q(authuser__user_authority__id__gte=authority_id)
            )
        )
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if with_counts:
            sql = '''select count(entity_id) from site_genericassociation a
				where a.source_type_id = (select id from django_content_type where model = 'snapshot')
				and a.entity_type_id = (select id from django_content_type where model = '{0}')
				and a.source_id = site_snapshot.id'''
            q = q.extra(
                select={
                    'photo_count': sql.format('photo'),
                    'audio_count': sql.format('audio'),
                    'processed_maps_count': sql.format('mapimage'),
                    'marker_count': sql.format('marker'),
                    'shared_with': 'select shared_with from v_views_shared_with WHERE v_views_shared_with.id = site_snapshot.id'
                }
            )
        if ordering_field:
            q = q.order_by(ordering_field)
        return q  # self.populate_tags_for_queryset(q)

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the ViewSerializer in the API?
        return []


#class SnapshotQuerySet(QuerySet, SnapshotMixin):
#    pass


class SnapshotManager(models.GeoManager, SnapshotMixin):
    #def get_queryset(self):
    #    return SnapshotQuerySet(self.model, using=self._db)
    pass


class FormMixin(GroupMixin):
    # For now, only the owner can view / edit a form.
    # Todo: restrict viewing data to the row-level, based on project
    # permissions.
    related_fields = ['owner', 'last_updated_by']
    prefetch_fields = ['users__user', 'projects', 'field_set']

    def my_forms(self, user=None):
        # a form is associated with one or more projects
        return self.model.objects.distinct().filter(
            Q(owner=user)
        ).order_by('name',)

    def all_forms(self):
        return self.model.objects.all().order_by('name',)

    def _get_objects(self, user, authority_id, project=None, request=None,
                     context=None, ordering_field='-time_stamp'
                     ):

        if user is None or not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be empty')

        q = (
            self.model.objects.distinct()
            .select_related(*self.related_fields)
                .filter(
                    Q(authuser__user=user) &
                    Q(authuser__user_authority__id__gte=authority_id)
            )
        )
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        q = q.extra(
            select={
                'form_fields': 'select form_fields from v_form_fields WHERE v_form_fields.id = site_form.id'
            }
        )
        q = q.order_by(ordering_field)
        return q

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

        from localground.apps.site.models import ObjectAuthority

        # condition #1: check if forms have been shared directly:
        c1 = (
            (
                Q(access_authority__id=ObjectAuthority.PUBLIC_WITH_LINK)
                &
                Q(access_key=access_key)
            ) |
            Q(access_authority__id=ObjectAuthority.PUBLIC)
        )

        # condition #2: check if any of the projects associated with
        #               forms have been shared (which means that the form
        #               has been indirectly shared)
        c2 = (
            (Q(
                projects__access_authority__id=ObjectAuthority.PUBLIC_WITH_LINK) & Q(
                projects__access_key=access_key)) | Q(
                projects__access_authority__id=ObjectAuthority.PUBLIC))

        q = self.model.objects.distinct().select_related(*self.related_fields)
        q = q.filter(c1 | c2)
        if request is not None:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q


class FormQuerySet(QuerySet, FormMixin):
    
    def delete(self):
        # ensure that the model's overrided delete method is called here
        for m in list(self):
            m.delete()


class FormManager(models.GeoManager, FormMixin):
    
    def get_queryset(self):
        return FormQuerySet(self.model, using=self._db)



class PresentationMixin(GroupMixin):

    def _get_objects(self, user, authority_id=1, request=None, context=None,
                     ordering_field='-time_stamp', with_counts=True, **kwargs):

        if user is None or not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be empty')

        q = (
            self.model.objects
            .select_related(*self.related_fields)
            .filter(
                Q(authuser__user=user) &
                Q(authuser__user_authority__id__gte=authority_id)
            )
        )
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q


#class PresentationQuerySet(QuerySet, PresentationMixin):
#    pass


class PresentationManager(models.GeoManager, PresentationMixin):
    #def get_queryset(self):
    #    return PresentationQuerySet(self.model, using=self._db)
    pass

    
class LayerMixin(GroupMixin):
    prefetch_fields = []

    def _get_objects(self, user, authority_id=1, request=None, context=None,
                     ordering_field='-time_stamp', with_counts=True, **kwargs):

        if user is None or not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be empty')

        q = (
            self.model.objects
            .select_related(*self.related_fields)
            .filter(
                Q(authuser__user=user) &
                Q(authuser__user_authority__id__gte=authority_id)
            )
        )
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q  # self.populate_tags_for_queryset(q)

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the ProjectSerializer in the API?
        return []


#class LayerQuerySet(QuerySet, LayerMixin):
#    pass


class LayerManager(models.GeoManager, LayerMixin):
    #def get_queryset(self):
    #    return LayerQuerySet(self.model, using=self._db)
    pass
