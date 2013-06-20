from django.contrib.gis.db import models
from django.db.models import Q
from django.db.models.query import QuerySet
from localground.apps.site.managers.base import GeneralMixin, GenericLocalGroundError

#class GroupMixin(object):
class GroupMixin(GeneralMixin):
    
    def get_objects(self, user, ordering_field='name', with_counts=True, **kwargs):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
        
        q = self.model.objects.distinct().select_related('owner', 'last_updated_by')
        q = q.filter(Q(owner=user) | Q(users__user=user))
        if with_counts:
            from django.db.models import Count
            q = q.annotate(processed_maps_count=Count('scan', distinct=True))
            q = q.annotate(photo_count=Count('photo', distinct=True))
            q = q.annotate(audio_count=Count('audio', distinct=True))
            q = q.annotate(marker_count=Count('marker', distinct=True))

        return q
    
    def apply_filter(self, user, query=None, order_by='id'):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.get_objects(user)
        if query is not None:
            q = query.extend_query(q)
        if order_by is not None:
            q = q.order_by(order_by)
        return q

class ProjectMixin(GroupMixin):
    def to_dict_list(self, include_auth_users=False, include_processed_maps=False,
                include_markers=False, include_audio=True, include_photos=False):
        dict_list = []
        
        # similar to p.to_dict(), but queries optimized at the list level 
        # rather than at the object level:
        from localground.apps.site.models import Scan, Audio, Photo, Marker
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
    