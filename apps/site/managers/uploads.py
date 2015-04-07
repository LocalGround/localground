from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import ObjectMixin
from localground.apps.lib.errors import GenericLocalGroundError


class UploadMixin(ObjectMixin):
    related_fields = ['project', 'owner', 'last_updated_by']
    prefetch_fields = []  # 'project__users__user']


class ScanMixin(UploadMixin):
    related_fields = [
        'status',
        'source_print',
        'project',
        'owner',
        'last_updated_by']

    def get_objects(self, user, project=None, request=None, context=None,
                    ordering_field='-time_stamp', processed_only=False):
        q = super(ScanMixin, self).get_objects(
            user, project=project, request=request, context=context,
            ordering_field=ordering_field
        )
        if processed_only:
            q = q.filter(status=2).filter(source_print__isnull=False)
        return q

    def failed_scans(self, user=None):
        q = self.model.objects.filter(status__in=(4,))
        if user is not None and not user.is_superuser:
            q.filter(owner=user)
        return q.order_by('time_stamp')

    def scans_in_queue(self, user=None):
        q = self.model.objects.filter(status__in=(1,))
        if user is not None:
            q.filter(owner=user)
        return q.order_by('time_stamp')


class ScanQuerySet(QuerySet, ScanMixin):
    pass


class ScanManager(models.GeoManager, ScanMixin):
    def get_query_set(self):
        return ScanQuerySet(self.model, using=self._db)


#class AttachmentQuerySet(QuerySet, UploadMixin):
#    pass


class AttachmentManager(models.GeoManager, ScanMixin):
    #def get_query_set(self):
    #    return AttachmentQuerySet(self.model, using=self._db)
    pass


class PhotoMixin(UploadMixin):
    pass


class PrintPermissionsMixin(object):

    def to_dict_list(self, include_scan_counts=False):
        if include_scan_counts:
            return [dict(p.to_dict(), num_scans=p.num_scans or 0)
                    for p in self]
        else:
            return [p.to_dict() for p in self]


#class PhotoQuerySet(QuerySet, PhotoMixin):
#    pass


class PhotoManager(models.GeoManager, PhotoMixin):
    #def get_query_set(self):
    #    return PhotoQuerySet(self.model, using=self._db)
    pass


class AudioMixin(UploadMixin):
    pass


#class AudioQuerySet(QuerySet, AudioMixin):
#    pass


class AudioManager(models.GeoManager, AudioMixin):
    #def get_query_set(self):
    #    return AudioQuerySet(self.model, using=self._db)
    pass


class VideoMixin(UploadMixin):
    pass


#class VideoQuerySet(QuerySet, AudioMixin):
#    pass


class VideoManager(models.GeoManager, VideoMixin):
    #def get_query_set(self):
    #    return VideoQuerySet(self.model, using=self._db)
    pass


class SnippetManager(models.Manager):

    def get_snippets_by_scan_id(self, user, scan_id, to_dict=True):
        if user is None or not user.is_authenticated():
            return []
        q = (self.model.objects.distinct()
             .filter(Q(user__groups__in=user.groups.all()))
             .filter(source_attachment__source_scan__id=scan_id)
             .order_by('file_name_orig')
             )
        if to_dict:
            return [s.to_dict() for s in q]
        return snippets


class RecordMixin(UploadMixin):

    def _get_objects(self, user, authority_id, project=None, request=None,
                     context=None, ordering_field='-time_stamp'):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        if not user.is_authenticated():
            raise GenericLocalGroundError('The user cannot be anonymous')
        q = (
            self.model.objects .select_related(
                *
                self.related_fields) .distinct() .filter(
                (Q(
                    project__authuser__user=user) & Q(
                    project__authuser__user_authority__id__gte=authority_id)) | Q(
                        owner=user)))
        if project:
            q = q.filter(project=project)
        if request:
            q = self._apply_sql_filter(q, request, context)
        q = q.prefetch_related(*self.prefetch_fields)
        if ordering_field:
            q = q.order_by(ordering_field)
        return q


#class RecordQuerySet(QuerySet, AudioMixin):
#    pass


class RecordManager(models.GeoManager, RecordMixin):
    related_fields = ['project', 'owner', 'form']

#    def get_query_set(self):
#        return RecordQuerySet(self.model, using=self._db)

    def get_objects_detailed(self, user, project=None, request=None,
                             context=None, ordering_field='-time_stamp',
                             attachment=None, manually_reviewed=None,
                             is_blank=None, has_geometry=None):
        '''
        Same as get_objects, but it queries for more related objects.
        '''
        from localground.apps.site import models
        self.related_fields = ['snippet', 'num_snippet', 'project',
                               'snippet__source_attachment', 'owner',
                               'form', 'form__project__id']
        form = models.Form.objects.get(table_name=self.model._meta.db_table)
        queryset = self.get_objects(
            user,
            project=project,
            request=request,
            context=context,
            ordering_field=ordering_field)
        queryset = queryset.distinct()
        if attachment is not None:
            queryset = queryset.filter(snippet__source_attachment=attachment)
        if manually_reviewed is not None:
            queryset = queryset.filter(manually_reviewed=manually_reviewed)
        if is_blank is not None:
            queryset = queryset.filter(
                Q(snippet__is_blank=is_blank) | Q(snippet__isnull=True))
        if has_geometry:
            queryset = queryset.filter(point__isnull=False)
        return queryset

    def get_objects_public(self, access_key=None, request=None, context=None,
                           ordering_field='-time_stamp', **kwargs):
        '''
        Returns all objects that belong to a project that has been
        marked as public
        '''
        from localground.apps.site import models
        form = models.Form.objects.get(table_name=self.model._meta.db_table)

        # if the form is public access, return all records.  Making a
        # data set publicly viewable means that EVERY record in the dataset
        # is public, regardless of the project permissions setting:
        if form.can_view(access_key=access_key):
            #q = self.model.objects.distinct().select_related(*self.related_fields)
            q = self.model.objects.select_related(*self.related_fields)
            if request is not None:
                q = self._apply_sql_filter(q, request, context)
            q = q.prefetch_related(*self.prefetch_fields)
            if ordering_field:
                q = q.order_by(ordering_field)
            return q

        # if the dataset is not public, return only those records that are
        # associated with a public project:
        else:
            #q = self.model.objects.distinct().select_related(*self.related_fields)
            q = self.model.objects.select_related(*self.related_fields)
            q = q.filter(
                (Q(project__access_authority__id=models.ObjectAuthority.PUBLIC_WITH_LINK)
                 & Q(project__access_key=access_key)) |
                Q(project__access_authority__id=models.ObjectAuthority.PUBLIC)
            )
            if request is not None:
                q = self._apply_sql_filter(q, request, context)
            q = q.prefetch_related(*self.prefetch_fields)
            if ordering_field:
                q = q.order_by(ordering_field)
            return q
