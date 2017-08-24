from django.contrib.gis.db.models import GeoManager
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import BaseMixin, ObjectMixin, GenericLocalGroundError
# Useful reference for chaining Model Managers together:
#    http://djangosnippets.org/snippets/2114/


class MarkerMixin():

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
        return self.append_extras(q, "count", project=project, forms=forms, user=user)

    def get_objects_with_lists(
            self,
            user,
            project=None,
            forms=None,
            ordering_field=None):
        q = self.get_objects(
            user,
            project=project,
            ordering_field=ordering_field)
        return self.append_extras(q, "array_agg", project=project, forms=forms, user=user)

    def append_extras(self, q, sql_function, forms=None, project=None, user=None):
        # Excellent resource on using extras:
        # http://timmyomahony.com/blog/2012/11/16/filtering-annotations-django/
        from localground.apps.site import models
        from django.contrib.contenttypes.models import ContentType
        suffix = sql_function.split("_")[0] #should either be "count" or "array"
        content_type_id = q.model.get_content_type().id
        table_name = q.model._meta.db_table
        #raise Exception(table_name)
        #raise Exception(suffix)

        child_classes = [models.Photo, models.Audio, models.MapImage, models.Video]

        # build a custom query that includes child counts:
        select = {}
        for cls in child_classes:
            select[cls.model_name + '_' + suffix] = '''
                SELECT %s(entity_id) FROM site_genericassociation e
                WHERE e.entity_type_id = %s AND e.source_type_id = %s AND
                e.source_id = %s.id
                ''' % (sql_function, cls.get_content_type().id, content_type_id, table_name)

        # record count is everything that's attached to a marker that's not
        # a Photo, Audio, or Map Image
        select['record_' + suffix] = '''
                SELECT %s(entity_id) FROM site_genericassociation e
                WHERE e.entity_type_id not in (%s) AND e.source_type_id = %s AND
                e.source_id = %s.id
                ''' % (sql_function,
            ','.join([
                str(ct.id) for ct in
                ContentType.objects.get_for_models(*child_classes)
                .values()
            ]),
            content_type_id,
            table_name
        )
        return q.extra(select)

    def get_objects_public_with_counts(
            self,
            forms=None,
            project=None,
            access_key=None,
            ordering_field=None):
        q = self.get_objects_public(
            access_key=access_key,
            ordering_field=ordering_field)
        return self.append_extras(q, "count", project=project, forms=forms)

    def get_objects_public_with_lists(
            self,
            forms=None,
            project=None,
            access_key=None,
            ordering_field=None):
        q = self.get_objects_public(
            access_key=access_key,
            ordering_field=ordering_field)
        return self.append_extras(q, "array_agg", project=project, forms=forms)

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the MarkerSerializer in the API?
        return []


#class MarkerQuerySet(QuerySet, MarkerMixin):
#    pass


class MarkerManager(GeoManager, ObjectMixin, MarkerMixin):
    #def get_queryset(self):
    #    return MarkerQuerySet(self.model, using=self._db)
    pass
