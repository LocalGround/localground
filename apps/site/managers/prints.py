from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q
from django.db.models import Count
from localground.apps.site.managers.base import ObjectMixin


#class PrintPermissionsQuerySet(QuerySet, ObjectMixin):
#    pass


class PrintPermissionsManager(models.GeoManager, ObjectMixin):
    #def get_queryset(self):
    #    return PrintPermissionsQuerySet(self.model, using=self._db)
    pass

class PrintMixin(ObjectMixin):
    related_fields = ['project', 'owner', 'last_updated_by', 'map_provider']

    def to_dict_list(self, include_mapimage_counts=False):
        if include_mapimage_counts:
            return [dict(p.to_dict(), num_mapimages=p.num_mapimages or 0)
                    for p in self]
        else:
            return [p.to_dict() for p in self]

    def get_prints_by_extent(
            self,
            north=None,
            south=None,
            east=None,
            west=None):
        import simplejson as json

        for n in [north, south, east, west]:
            if n is None:
                return []

        sql = 'select id, ST_AsGeoJson(northeast) as ne, ST_AsGeoJson(southwest) as sw, \
              map_title, count(id) as num_mapimages from prints, mapimages_mapimage \
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
                'num_mapimages': p.num_mapimages,
                'map_title': p.map_title
            })

        return return_obj

class PrintQuerySet(QuerySet, PrintMixin):
    pass


class PrintManager(models.GeoManager, PrintMixin):
    def get_queryset(self):
        return PrintQuerySet(self.model, using=self._db)

