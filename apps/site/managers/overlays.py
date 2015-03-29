from django.contrib.gis.db.models import GeoManager
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import BaseMixin, ObjectMixin, GenericLocalGroundError
# Useful reference for chaining Model Managers together:
#    http://djangosnippets.org/snippets/2114/


class MarkerMixin(ObjectMixin):

    def get_objects_with_counts(
            self,
            user,
            project=None,
            forms=None,
            ordering_field=None):
        q = self.get_objects(
            user,
            project=project,
            ordering_field=ordering_field)
        return self.append_extras(q, project=project, forms=forms, user=user)

    def append_extras(self, q, forms=None, project=None, user=None):
        # Excellent resource on using extras:
        # http://timmyomahony.com/blog/2012/11/16/filtering-annotations-django/
        from localground.apps.site import models
        from django.contrib.contenttypes.models import ContentType

        child_classes = [models.Photo, models.Audio, models.Scan]

        # build a custom query that includes child counts:
        select = {}
        for cls in child_classes:
            select[cls.model_name + '_count'] = '''
                SELECT COUNT(entity_id) FROM site_genericassociation e
                WHERE e.entity_type_id = %s AND e.source_type_id = %s AND
                e.source_id = site_marker.id
                ''' % (cls.get_content_type().id, models.Marker.get_content_type().id)

        # record count is everything that's attached to a marker that's not
        # a Photo, Audio, or Map Image
        select['record_count'] = '''
                SELECT COUNT(entity_id) FROM site_genericassociation e
                WHERE e.entity_type_id not in (%s) AND e.source_type_id = %s AND
                e.source_id = site_marker.id
                ''' % (
            ','.join([
                str(ct.id) for ct in
                ContentType.objects.get_for_models(*child_classes)
                .values()
            ]),
            models.Marker.get_content_type().id
        )
        q = q.extra(select)
        return self.populate_tags_for_queryset(q)

    def get_objects_public_with_counts(
            self,
            forms=None,
            project=None,
            access_key=None,
            ordering_field=None):
        q = self.get_objects_public(
            access_key=access_key,
            ordering_field=ordering_field)
        return self.append_extras(q, project=project, forms=forms)

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the MarkerSerializer in the API?
        return []


#class MarkerQuerySet(QuerySet, MarkerMixin):
#    pass


class MarkerManager(GeoManager, MarkerMixin):
    #def get_query_set(self):
    #    return MarkerQuerySet(self.model, using=self._db)
    pass


class WMSOverlayMixin(BaseMixin):
    related_fields = ['overlay_source', 'overlay_type']

    def get_objects(self, user=None, filter=None, is_printable=None,
                    ordering_field=None, **kwargs):
        '''
        todo: we want to deprecate group-level overlays in favor of individual-level
        site; for now, exclude any overlays; only include base tiles, until we can
        figure out what to do:
        '''
        q = (self.model.objects
             .select_related(*self.related_fields)
             .filter(overlay_type__id=1)
             )
        if is_printable is not None:
            q = q.filter(is_printable=is_printable)
        return q


class WMSOverlayQuerySet(QuerySet, WMSOverlayMixin):
    pass

class WMSOverlayManager(GeoManager, WMSOverlayMixin):
    
    def get_query_set(self):
        return WMSOverlayQuerySet(self.model, using=self._db)
    
