from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import ObjectMixin
from localground.apps.lib.errors import GenericLocalGroundError


class UploadMixin(ObjectMixin):
    related_fields = ['project', 'owner', 'last_updated_by']
    prefetch_fields = []  # 'project__users__user']


class MapImageMixin(UploadMixin):
    related_fields = [
        'status',
        'source_print',
        'project',
        'owner',
        'last_updated_by']

    def get_objects(self, user, project=None, request=None, context=None,
                    ordering_field='-time_stamp', processed_only=False):
        q = super(MapImageMixin, self).get_objects(
            user, project=project, request=request, context=context,
            ordering_field=ordering_field
        )
        if processed_only:
            q = q.filter(status=2).filter(source_print__isnull=False)
        return q

    def failed_mapimages(self, user=None):
        q = self.model.objects.filter(status__in=(4,))
        if user is not None and not user.is_superuser:
            q.filter(owner=user)
        return q.order_by('time_stamp')

    def mapimages_in_queue(self, user=None):
        q = self.model.objects.filter(status__in=(1,))
        if user is not None:
            q.filter(owner=user)
        return q.order_by('time_stamp')


class MapImageQuerySet(QuerySet, MapImageMixin):
    pass


class MapImageManager(models.GeoManager, MapImageMixin):
    def get_queryset(self):
        return MapImageQuerySet(self.model, using=self._db)
    
    

class PhotoMixin(UploadMixin):
    pass


class PrintPermissionsMixin(object):

    def to_dict_list(self, include_mapimage_counts=False):
        if include_mapimage_counts:
            return [dict(p.to_dict(), num_mapimages=p.num_mapimages or 0)
                    for p in self]
        else:
            return [p.to_dict() for p in self]


#class PhotoQuerySet(QuerySet, PhotoMixin):
#    pass


class PhotoManager(models.GeoManager, PhotoMixin):
    #def get_queryset(self):
    #    return PhotoQuerySet(self.model, using=self._db)
    pass


class AudioMixin(UploadMixin):
    pass


#class AudioQuerySet(QuerySet, AudioMixin):
#    pass


class AudioManager(models.GeoManager, AudioMixin):
    #def get_queryset(self):
    #    return AudioQuerySet(self.model, using=self._db)
    pass


class VideoMixin(UploadMixin):
    pass


#class VideoQuerySet(QuerySet, AudioMixin):
#    pass


class VideoManager(models.GeoManager, VideoMixin):
    #def get_queryset(self):
    #    return VideoQuerySet(self.model, using=self._db)
    pass

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
    related_fields = ['project', 'owner'] #, 'form']

#    def get_queryset(self):
#        return RecordQuerySet(self.model, using=self._db)

    def get_objects_detailed(self, user, project=None, request=None,
                             context=None, ordering_field='-time_stamp',
                             has_geometry=None):
        '''
        Same as get_objects, but it queries for more related objects.
        '''
        from localground.apps.site import models
        self.related_fields = ['project', 'owner']
        form = models.Form.objects.get(table_name=self.model._meta.db_table)
        queryset = self.get_objects(
            user,
            project=project,
            request=request,
            context=context,
            ordering_field=ordering_field)
        queryset = queryset.distinct()
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
