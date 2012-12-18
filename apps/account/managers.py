from django.contrib.gis.db import models
from django.db.models import Q
from django.db.models.query import QuerySet

class GroupMixin(object):
    
    def get_objects_with_counts(self, user, ordering='name'):
        
        sql = '''select distinct g.id, g.name, g.description, g.last_updated, g.user_id, 
            s.processed_maps_count, a.audio_count, p.photo_count, m.marker_count 
            from 
            account_%s g left join 
            account_userauthorityobject pu on g.id = pu.object_id left join 
            (select project_id, count(id) as processed_maps_count from uploads_scan 
            group by project_id) s 
            ON (g.id = s.project_id) 
            left join 
            (select project_id, count(id) as audio_count from uploads_audio 
            group by project_id) a 
            ON (g.id = a.project_id) 
            left join 
            (select project_id, count(id) as photo_count from uploads_photo 
            group by project_id) p 
            ON (g.id = p.project_id) 
            left join 
            (select project_id, count(id) as marker_count from overlays_marker 
            group by project_id) m 
            ON (g.id = m.project_id)
        ''' % str(self.model.__name__).lower()
        if user is not None: #only accessible to superusers
            sql = sql +  ' where g.user_id = %s or pu.user_id = %s' \
                        % (user.id, user.id)
        if ordering == 'name':
            sql = sql +  ' order by g.name'
        elif ordering == 'id': 
            sql = sql +  ' order by g.id'
        return list(self.model.objects.raw(sql))
   
    def get_objects(self, user):
        q = self.model.objects.select_related('owner')
        if user is not None: #only accessible to superusers
            filter_expression = Q(owner=user) | Q(users__user=user)
            q = q.filter(filter_expression)
        q = q.distinct()
        return q.order_by('name')


class ProjectMixin(GroupMixin):
    def to_dict_list(self, include_auth_users=False, include_processed_maps=False,
                include_markers=False, include_audio=True, include_photos=False):
        dict_list = []
        
        # similar to p.to_dict(), but queries optimized at the list level 
        # rather than at the object level:
        from localground.apps.uploads.models import Scan, Audio, Photo
        from localground.apps.overlays.models import Marker
        scan_set, audio_set, photo_set, marker_set = None, None, None, None
        project_ids = [p.id for p in self]
        if len(project_ids) > 0:
            if include_processed_maps:
                scan_set = Scan.objects.by_projects(project_ids)
            if include_audio:
                audio_set = Audio.objects.by_projects(project_ids)
            if include_photos:
                photo_set = Photo.objects.by_projects(project_ids)
            if include_markers:
                marker_set = Marker.objects.by_projects(project_ids)
            
        def get_list(p, obj_set):
            arr = []
            if obj_set is not None:
                for o in obj_set:
                    if o.project.id == p.id:
                        arr.append(o.to_dict())
            return arr
            
        
        for p in self:
            e = p.to_dict()
            
            e.update({
                'processed_maps': get_list(p, scan_set), 
                'photos': get_list(p, photo_set), 
                'audio': get_list(p, audio_set), 
                'markers': get_list(p, marker_set)   
            })
            dict_list.append(e)
        
        return dict_list
    
    
class ProjectQuerySet(QuerySet, ProjectMixin):
    pass

class ProjectManager(models.GeoManager, ProjectMixin):
    def get_query_set(self):
        return ProjectQuerySet(self.model, using=self._db)
        
        
class ViewMixin(GroupMixin):
    def to_dict_list(self):
        return []
    
class ViewQuerySet(QuerySet, ViewMixin):
    pass

class ViewManager(models.GeoManager, ViewMixin):
    def get_query_set(self):
        return ViewQuerySet(self.model, using=self._db) 
    