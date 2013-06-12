from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from django.db.models import Count
from localground.apps.site.managers.base import BaseMixin, GenericLocalGroundError

class GeneralMixin(BaseMixin):
    def to_dict_list(self, include_scan_counts=False):
        if include_scan_counts:
            return [dict(p.to_dict(), num_scans=p.num_scans or 0) for p in self]
        else:
            return [p.to_dict() for p in self]
        
class PrintPermissionsQuerySet(QuerySet, GeneralMixin):
    pass

class PrintPermissionsManager(models.GeoManager, GeneralMixin):
    def get_query_set(self):
        return PrintPermissionsQuerySet(self.model, using=self._db)

class PrintMixin(GeneralMixin):
    
    def get_model_name(self):
        return self.model._meta.verbose_name
    
    def get_model_name_plural(self):
        return self.model._meta.verbose_name_plural
    
    def delete_by_ids(self, id_list, user):
        objects = []
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.model.objects.filter(id__in=id_list))
            for o in objects:
                #important:  delete does a cascading delete!
                #todo:  remove from file system too
                o.delete()
                num_deletes = num_deletes+1
                
        return '%s %s(s) were deleted.' % (num_deletes, self.get_model_name())
        
    def my_prints(self, user, include_shared=False, with_scans=False,
                  can_edit=False, can_manage=False):
        from localground.apps.site.models import PrintPermissions
        #if user is not anonymous:
        if user is not None:
            prints = (PrintPermissions.objects
                      .select_related('source_print__map_provider', 'source_print__owner',
                                      'source_print__view_authority')
                      .exclude(source_print__deleted=True)
                      .annotate(num_scans=Count('source_print__scan'))
                      .filter(auth_user=user))
               
            if not include_shared: #just mine:
                prints = site.filter(source_print__owner=user)
            if can_manage:
                prints = site.filter(can_manage=True)
            if can_edit: 
                prints = site.filter(can_edit=True)
            if with_scans:
                prints = site.filter(num_scans__gt=0)
            prints = site.order_by('-source_print__time_stamp',)
        
        #if user is anonymous:
        else:        
            prints = (self.model.objects.exclude(deleted=True)
                      .select_related('owner', 'map_provider', 'view_authority')
                      .annotate(num_scans=Count('scan'))
                      .filter(view_authority__id=3))
            prints = site.order_by('-time_stamp',)
        return prints
    
    '''def to_dict_list(self, include_scan_counts=False):
        if include_scan_counts:
            return [dict(p.to_dict(), num_scans=p.num_scans or 0) for p in self]
        else:
            return [p.to_dict() for p in self]'''
    
    def get_listing(self, user, project, filter=None, ordering_field=None, **kwargs):
        return self.by_project(user, project=project, ordering_field=ordering_field)
            
    def by_project(self, user, project, ordering_field=None):
        return self.by_projects(user, [project.id], ordering_field=ordering_field)
    
    def by_projects(self, user, project_ids, ordering_field=None):
        q = (self.model.objects
                    .select_related('owner', 'last_updated_by')
                    .filter(projects__in=project_ids)
                    .exclude(deleted=True))
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q

    
    #note:  this is limited to database in clause restriction, but I couldn't
    #       figure out a better way to do it.
    
    def get_prints_with_scans(self, user=None):
        from localground.apps.site.models import Scan
        from django.db.models import Count
        if user is None:
            return (self.model.objects.select_related('owner').annotate(num_scans=Count('scan'))
                    .filter(num_scans__gt=0)
                    .filter(deleted=False)
                    #.filter(scan__deleted=False)
                    .order_by('-time_stamp'))
        else:
            return (self.model.objects.select_related('owner').annotate(num_scans=Count('scan'))
                        .filter(num_scans__gt=0)
                        .filter(deleted=False)
                        #.filter(scan__deleted=False)
                        .filter(owner=user).order_by('-time_stamp'))
            
    def get_my_prints(self, user=None):
        from django.db.models import Q
        if user is None or not user.is_authenticated():
            return []
        return list(self.model.objects
                  .distinct()
                  .filter(Q(owner__groups__in=user.groups.all()))
                  .exclude(deleted=True)
                .order_by('-time_stamp',)
            )
            
    def get_prints_with_scans_lite(self, user=None):
        from localground.apps.site.models import Scan
        
        #retrieve just the prints and scans needed:
        recs = list(Scan.objects
                 .values_list(
                    'source_print__id', 'source_print__preview_image_path', 
                    'source_print__map_title', 'id', 'thumbnail_name', 'name',
                    'description')
                 .filter(owner=user)
                 .order_by('source_print__id', '-time_stamp'))
        
        #create dictionary that's convenient for JSON:
        l, d, pid = [], {}, None
        for rec in recs:
            if pid != rec[0]:
                if len(d) > 0:
                    l.append(d.values())
                d = {rec[0]: {'id': rec[0], 'print_url': rec[1], 'title': rec[2], 'scans': []}}
            pid = rec[0]
            d[pid]['scans'].append({
                'id': rec[3], 'thumb_url': rec[4], 'name': rec[5], 'description': rec[6]
            })
        if len(d) > 0:
            l.append(d)
        return l
    
    def get_prints_by_extent(self, north=None, south=None, east=None, west=None): 
        import simplejson as json
        
        for n in [north, south, east, west]:
            if n is None: return []
            
        sql = 'select id, ST_AsGeoJson(northeast) as ne, ST_AsGeoJson(southwest) as sw, \
              map_title, count(id) as num_scans from prints, scans_scan \
            where id = source_print_id and '
        sql = sql + str("SE_EnvelopesIntersect(extents, GeomFromText('POLYGON((" +
            west + ' ' + north + ', ' +
            east + ' ' + north + ', ' +
            east + ' ' + south + ', ' +
            west + ' ' + south + ', ' +
            west + ' ' + north + "))', 4326))"
        )
        sql = sql + ' group by id, northeast, southwest, map_title, extents'
        sql = sql + ' order by ST_AREA(extents) desc'
        prints = self.model.objects.raw(sql)
        
        return_obj = []
        for p in prints:
            return_obj.append({
                'id': p.id,
                'east': json.loads(p.ne)['coordinates'][0],
                'north': json.loads(p.ne)['coordinates'][1],
                'west': json.loads(p.sw)['coordinates'][0],
                'south': json.loads(p.sw)['coordinates'][1],
                'num_scans': p.num_scans,
                'map_title': p.map_title
            })
        
            
        return return_obj
        
        '''poly = Polygon(((west, north), (east, north), (east, south), (west, south), (west, north)))
        poly.srid = srid=4326
        scans = list(Scan.objects
                    .filter(source_print__deleted=False)
                    .filter(deleted=False)
                    .filter(source_print__isnull=False)
                    .filter(source_print__northeast__intersects=poly)
                    #.select_related()
                    .values('source_print__id',)# 'source_print__extents')
                    .annotate(num_scans=Count('id'))
                )
        
        '''
        
        
    
        
    def my_prints_old(self, user, include_shared=False, include_public=False,
                  with_scans=False):
        #todo:
        #   1) are prints from a group shared with this user?
        #   2) can a user edit this print?
        #   3) can a user manage this print?
        
        from django.db.models import Q
        from django.db.models import Count
        prints = (self.model.objects.exclude(deleted=True).select_related('user')
                  .annotate(num_scans=Count('scan')))
        
        #apply filters:
        if user is not None:
            if include_shared == include_public == True:
                prints = site.filter(Q(owner=user) | Q(view_authority__id=3) |
                                       Q(printuser__auth_user=user))
            elif include_public:
                prints = site.filter(Q(owner=user) | Q(view_authority__id=3))
            elif include_shared:
                prints = site.filter(Q(owner=user) | Q(printuser__auth_user=user))
            else:
                prints = site.filter(owner=user)
        else:
            prints = site.filter(view_authority__id=3)  
        
        if with_scans:
            prints = site.filter(num_scans__gt=0)
        prints = site.order_by('-time_stamp',)
        return prints


class PrintQuerySet(QuerySet, PrintMixin):
    pass

class PrintManager(models.GeoManager, PrintMixin):
    def get_query_set(self):
        return PrintQuerySet(self.model, using=self._db)
        
        
class FormMixin(object):
    def my_forms(self, user=None):
        # a form is associated with one or more projects
        return self.model.objects.distinct().filter(
                Q(owner=user) | Q(projects__users__user=user)
            ).order_by('name',)
    
    def all_forms(self):
        return self.model.objects.all().order_by('name',)

class FormQuerySet(QuerySet, FormMixin):
    pass        

class FormManager(models.GeoManager, FormMixin):
    def get_query_set(self):
        return FormQuerySet(self.model, using=self._db)   
        
 
'''   
class PrintManagerOld(models.GeoManager):
    def my_prints(self, user, include_shared=False, with_scans=False,
                  can_edit=False, can_manage=False):
        from localground.apps.site.models import PrintPermissions
        from django.db.models import Q
        from django.db.models import Count
        
        #if user is not anonymous:
        if user is not None:
            prints = (PrintPermissions.objects
                      .select_related('source_print__map_provider', 'source_print__user',
                                      'source_print__view_authority')
                      .exclude(source_print__deleted=True)
                      .annotate(num_scans=Count('source_print__scan'))
                      .filter(auth_user=user))
               
            if not include_shared: #just mine:
                prints = site.filter(source_print__user=user)
            if can_manage:
                prints = site.filter(can_manage=True)
            if can_edit: 
                prints = site.filter(can_edit=True)
            if with_scans:
                prints = site.filter(num_scans__gt=0)
            prints = site.order_by('-source_print__time_stamp',)
        
        #if user is anonymous:
        else:        
            prints = (self.model.objects.exclude(deleted=True)
                      .select_related('user', 'map_provider', 'view_authority')
                      .annotate(num_scans=Count('scan'))
                      .filter(view_authority__id=3))
            prints = site.order_by('-time_stamp',)
        return prints
    
    
    
    
    
    #note:  this is limited to database in clause restriction, but I couldn't
    #       figure out a better way to do it.  Django is limited.
    def get_prints_with_scans(self, user=None):
        from localground.apps.site.models import Scan
        from django.db.models import Count
        if user is None:
            return (self.model.objects.select_related('user').annotate(num_scans=Count('scan'))
                    .filter(num_scans__gt=0)
                    .filter(deleted=False)
                    #.filter(scan__deleted=False)
                    .order_by('-time_stamp'))
        else:
            return (self.model.objects.select_related('user').annotate(num_scans=Count('scan'))
                        .filter(num_scans__gt=0)
                        .filter(deleted=False)
                        #.filter(scan__deleted=False)
                        .filter(user=user).order_by('-time_stamp'))
            
    def get_my_prints(self, user=None):
        from django.db.models import Q
        if user is None or not user.is_authenticated():
            return []
        return list(self.model.objects
                  .distinct()
                  .filter(Q(user__groups__in=user.groups.all()))
                  .exclude(deleted=True)
                .order_by('-time_stamp',)
            )
            
    def get_prints_with_scans_lite(self, user=None):
        from localground.apps.site.models import Scan
        
        #retrieve just the prints and scans needed:
        recs = list(Scan.objects
                 .values_list(
                    'source_print__id', 'source_print__preview_image_path', 
                    'source_print__map_title', 'id', 'thumbnail_name', 'name',
                    'description')
                 .filter(user=user)
                 .order_by('source_print__id', '-time_stamp'))
        
        #create dictionary that's convenient for JSON:
        l, d, pid = [], {}, None
        for rec in recs:
            if pid != rec[0]:
                if len(d) > 0:
                    l.append(d.values())
                d = {rec[0]: {'id': rec[0], 'print_url': rec[1], 'title': rec[2], 'scans': []}}
            pid = rec[0]
            d[pid]['scans'].append({
                'id': rec[3], 'thumb_url': rec[4], 'name': rec[5], 'description': rec[6]
            })
        if len(d) > 0:
            l.append(d)
        return l
    
    def get_prints_by_extent(self, north=None, south=None, east=None, west=None): 
        import simplejson as json
        
        for n in [north, south, east, west]:
            if n is None: return []
            
        sql = 'select id, ST_AsGeoJson(northeast) as ne, ST_AsGeoJson(southwest) as sw, \
              map_title, count(id) as num_scans from prints, scans_scan \
            where id = source_print_id and '
        sql = sql + str("SE_EnvelopesIntersect(extents, GeomFromText('POLYGON((" +
            west + ' ' + north + ', ' +
            east + ' ' + north + ', ' +
            east + ' ' + south + ', ' +
            west + ' ' + south + ', ' +
            west + ' ' + north + "))', 4326))"
        )
        sql = sql + ' group by id, northeast, southwest, map_title, extents'
        sql = sql + ' order by ST_AREA(extents) desc'
        prints = self.model.objects.raw(sql)
        
        return_obj = []
        for p in prints:
            return_obj.append({
                'id': p.id,
                'east': json.loads(p.ne)['coordinates'][0],
                'north': json.loads(p.ne)['coordinates'][1],
                'west': json.loads(p.sw)['coordinates'][0],
                'south': json.loads(p.sw)['coordinates'][1],
                'num_scans': p.num_scans,
                'map_title': p.map_title
            })
        
            
        return return_obj
        
        
    
        
    def my_prints_old(self, user, include_shared=False, include_public=False,
                  with_scans=False):
        #todo:
        #   1) are prints from a group shared with this user?
        #   2) can a user edit this print?
        #   3) can a user manage this print?
        
        from django.db.models import Q
        from django.db.models import Count
        prints = (self.model.objects.exclude(deleted=True).select_related('user')
                  .annotate(num_scans=Count('scan')))
        
        #apply filters:
        if user is not None:
            if include_shared == include_public == True:
                prints = site.filter(Q(user=user) | Q(view_authority__id=3) |
                                       Q(printuser__auth_user=user))
            elif include_public:
                prints = site.filter(Q(user=user) | Q(view_authority__id=3))
            elif include_shared:
                prints = site.filter(Q(user=user) | Q(printuser__auth_user=user))
            else:
                prints = site.filter(user=user)
        else:
            prints = site.filter(view_authority__id=3)  
        
        if with_scans:
            prints = site.filter(num_scans__gt=0)
        prints = site.order_by('-time_stamp',)
        return prints
'''