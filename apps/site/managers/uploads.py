from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import ObjectMixin
      
class ScanMixin(ObjectMixin):
    
    def get_objects(self, user, project=None, ordering_field=None, processed_only=False):
        q = super(ScanMixin, self).get_objects(user, project=project, ordering_field=ordering_field)
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
        
class AttachmentQuerySet(QuerySet, ObjectMixin):
    pass

class AttachmentManager(models.GeoManager, ScanMixin):
    def get_query_set(self):
        return AttachmentQuerySet(self.model, using=self._db)
        
class PhotoMixin(ObjectMixin):
    pass
    
class PrintPermissionsMixin(object):
    def to_dict_list(self, include_scan_counts=False):
        if include_scan_counts:
            return [dict(p.to_dict(), num_scans=p.num_scans or 0) for p in self]
        else:
            return [p.to_dict() for p in self]
        
class PhotoQuerySet(QuerySet, PhotoMixin):
    pass

class PhotoManager(models.GeoManager, PhotoMixin):
    def get_query_set(self):
        return PhotoQuerySet(self.model, using=self._db)
        
class AudioMixin(ObjectMixin):
    pass

class AudioQuerySet(QuerySet, AudioMixin):
    pass

class AudioManager(models.GeoManager, AudioMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)
 
class VideoMixin(ObjectMixin):
    pass

class VideoQuerySet(QuerySet, AudioMixin):
    pass
   
class VideoManager(models.GeoManager, VideoMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)  

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
    

