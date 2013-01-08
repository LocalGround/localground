from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import BaseMixin, GenericLocalGroundError

#Useful reference for chaining Model Managers together:
#    http://djangosnippets.org/snippets/2114/


class MarkerMixin(BaseMixin):
    
    def by_project(self, prj):
        return self.model.objects.filter(project=prj)
        
    def by_projects(self, project_ids):
        return self.model.objects.filter(project__id__in=project_ids)
        
    def by_project_with_counts(prj):
        self.by_projects_with_counts([prj.id])
    
    def by_projects_with_counts(self, project_ids):
        from localground.apps.site.models import Form
        from django.db.models import Count, Q
        #todo:  make a view instead:
        sql = 'select m.id, m.project_id, m.time_stamp, m.name, m.user_id, \
            m.point, p.photo_count, a.audio_count, \
            v.video_count, 0 as note_count \
         from site_marker m left join \
         (select source_marker_id, count(id) as photo_count \
          from site_photo group by source_marker_id) p \
         on m.id = p.source_marker_id left join \
         (select source_marker_id, count(id) as audio_count \
          from site_audio group by source_marker_id) a \
         on m.id = a.source_marker_id left join \
         (select source_marker_id, count(id) as video_count \
          from site_video group by source_marker_id) v \
         on m.id = v.source_marker_id \
         where m.project_id in (' + ', '.join(map(str,project_ids)) + ') \
         order by m.name'
        
        markers = list(self.model.objects.raw(sql))
        
        #getting note counts is a little more complicated:
        forms = list(Form.objects.filter(projects__id__in=project_ids))
        for form in forms:
            recs = list(form.TableModel.objects.distinct().values('source_marker__id')
                            .annotate(num_notes=Count('id'))
                            .filter(project__id__in=project_ids)
                            .filter(source_marker__isnull=False)
                            .filter(Q(snippet__is_blank=False) | Q(snippet__isnull=True)))
            for rec in recs:
                for marker in markers:
                    if marker.id == rec['source_marker__id']:
                        marker.note_count = marker.note_count + int(rec['num_notes'])
                        break
        
        return markers
    
    def by_marker_ids_with_counts(self, marker_ids):
        from localground.apps.site.models import Form
        from django.db.models import Count, Q
        #todo:  make a view instead:
        sql = 'select m.id, m.project_id, m.time_stamp, m.name, m.user_id, \
            m.point, p.photo_count, a.audio_count, \
            v.video_count, 0 as note_count \
         from site_marker m left join \
         (select source_marker_id, count(id) as photo_count \
          from site_photo group by source_marker_id) p \
         on m.id = p.source_marker_id left join \
         (select source_marker_id, count(id) as audio_count \
          from site_audio group by source_marker_id) a \
         on m.id = a.source_marker_id left join \
         (select source_marker_id, count(id) as video_count \
          from site_video group by source_marker_id) v \
         on m.id = v.source_marker_id \
         where m.id in (' + ', '.join(map(str,marker_ids)) + ') \
         order by m.name'
        
        markers = list(self.model.objects.raw(sql))
        project_ids = [m.project.id for m in markers]
        
        #getting note counts is a little more complicated:
        forms = list(Form.objects.filter(projects__id__in=project_ids))
        for form in forms:
            recs = list(form.TableModel.objects.distinct().values('source_marker__id')
                            .annotate(num_notes=Count('id'))
                            .filter(project__id__in=project_ids)
                            .filter(source_marker__isnull=False)
                            .filter(Q(snippet__is_blank=False) | Q(snippet__isnull=True)))
            for rec in recs:
                for marker in markers:
                    if marker.id == rec['source_marker__id']:
                        marker.note_count = marker.note_count + int(rec['num_notes'])
                        break
        
        return markers

    
    def by_project_with_counts_dict_list(self, prj):
        return self.by_projects_with_counts_dict_list([prj.id])
    
    def by_projects_with_counts_dict_list(self, project_ids):
        r = self.by_projects_with_counts(project_ids)
        dict_list = []
        for m in r:
            dict_list.append(m.to_dict(aggregate=True))
        return dict_list
    
    def by_markers_with_counts_dict_list(self, marker_ids):
        r = self.by_marker_ids_with_counts(marker_ids)
        dict_list = []
        for m in r:
            dict_list.append(m.to_dict(aggregate=True))
        return dict_list

    def to_dict_list(self):
        from localground.apps.site.models import Scan, Audio, Photo
        dict_list = []
        
        for m in self:
            dict_list.append(m.to_dict(aggregate=False))
        
        return dict_list

class MarkerQuerySet(QuerySet, MarkerMixin):
    pass

class MarkerManager(models.GeoManager, MarkerMixin):
    def get_query_set(self):
        return MarkerQuerySet(self.model, using=self._db)


class WMSOverlayMixin(BaseMixin):
    
    def get_all(self, user=None, overlay_type=None, is_printable=None, **kwargs):
        '''
        todo: we want to deprecate group-level overlays in favor of individual-level
            site.
        '''
        q = (self.model.objects
                    .select_related('overlay_source', 'overlay_type'))
        if overlay_type is not None:
            q = q.filter(overlay_type__id=overlay_type)
        if is_printable is not None:
            q = q.filter(is_printable=is_printable)
        return q
    
    def get_my_overlays(self, user=None, overlay_type=None, is_printable=None):
        q = self.get_all(user=user, overlay_type=overlay_type, is_printable=is_printable)
        return [o.to_dict() for o in list(q.distinct())] 
    
class WMSOverlayQuerySet(QuerySet, WMSOverlayMixin):
    pass

        
class WMSOverlayManager(models.GeoManager, WMSOverlayMixin):
    def get_query_set(self):
        return WMSOverlayQuerySet(self.model, using=self._db)



