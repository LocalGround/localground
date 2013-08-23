from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import GeneralMixin

        
class ScanMixin(GeneralMixin):
    
    def get_objects(self, user, project=None, filter=None, processed_only=False, ordering_field=None):
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
        
class AttachmentQuerySet(QuerySet, GeneralMixin):
    pass

class AttachmentManager(models.GeoManager, ScanMixin):
    def get_query_set(self):
        return AttachmentQuerySet(self.model, using=self._db)
        
class PhotoMixin(GeneralMixin):
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
        
class AudioMixin(GeneralMixin):
    pass

class AudioQuerySet(QuerySet, AudioMixin):
    pass

class AudioManager(models.GeoManager, AudioMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)
 
class VideoMixin(GeneralMixin):
    pass

class VideoQuerySet(QuerySet, AudioMixin):
    pass
   
class VideoManager(models.GeoManager, VideoMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)  
    

class ReviewManager(models.Manager):
    def get_reviews_by_print_id(self, print_id):
        reviews = list(
            self.model.objects.filter(source_marker__scan__source_print__id=print_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)
        
    def get_reviews_by_scan_id(self, scan_id):
        reviews = list(
            self.model.objects.filter(source_marker__scan__id=scan_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)
        
    def get_reviews_by_marker_id(self, marker_id):
        reviews = list(
            self.model.objects.filter(source_marker__id=marker_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self.get_reviews_by_marker_ids([marker_id])
    
    def get_reviews_by_marker_ids(self, marker_ids):
        reviews = list(
            self.model.objects.filter(source_marker__id__in=marker_ids)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)

    def _parse_reviews(self, reviews): 
        #from localground.apps.site.models import Note
        review_ids = [r[0] for r in reviews]
        review_ids = [r[0] for r in reviews]
        
        #todo:  group by marker
        
        #get notes:
        #notes = list(Note.objects.select_related('source_review__id', 'source_snippet').filter(source_review__id__in=review_ids))
        
        #get form_1_grocery entries:
        if len(review_ids) > 0:
            from django.db import connection
            cursor = connection.cursor()
            sql = 'SELECT id, review_id, rating, category FROM form_1_grocery where review_id in (' + ', '.join(map(str,review_ids)) + ')'
            cursor.execute(sql)
            store_reviews = cursor.fetchall()
            
            #get form_2_observation entries:
            sql = 'SELECT id, review_id, rating FROM form_2_observation where review_id in (' + ', '.join(map(str,review_ids)) + ')'
            cursor.execute(sql)
            observations = cursor.fetchall()

        review_dict_array = []
        for r in reviews:
            dict = {
                'id': r[0],
                'marker_id': r[1],
                'scan_id': r[2]
            }
            #for n in notes:
            #    if n.source_review.id == r[0]:
            #        dict.update({'note': n.to_dict()})
            if store_reviews is not None:
                for s in store_reviews:
                    if r[0] == s[1]:
                        dict.update({
                            'store_review': {
                                'id': s[0],
                                'rating': s[2],
                                'category': s[3],
                                'requery': False
                            }
                        })
            if observations is not None:
                for o in observations:
                    if r[0] == o[1]:
                        dict.update({
                            'observation': {
                                'id': o[0],
                                'rating': o[2],
                                'requery': False
                            }
                        })
            review_dict_array.append(dict)
        return review_dict_array
    
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
    

