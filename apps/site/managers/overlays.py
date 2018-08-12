from django.contrib.gis.db.models import GeoManager
from django.db.models.query import QuerySet
from django.db.models import Q
from localground.apps.site.managers.base import BaseMixin, \
    ObjectMixin, GenericLocalGroundError
# Useful reference for chaining Model Managers together:
#    http://djangosnippets.org/snippets/2114/


class MarkerMixin():
    # Sarah wants to refactor this into two functions.
    # It currently handles filtering of:
    # 1) Records with attributes (i.e. Markers with Attributes)
    # 2) Records without attributes (i.e. plain Markers)
    def _get_objects_with_extras(
            self, aggregation_type, dataset=None, project=None,
            ordering_field=None):
        if dataset:
            # return Records belonging to a specific dataset
            q = self.filter(dataset=dataset)

        elif project and dataset==None:
            # only return Records with NO datasets, i.e. records without hstore attributes
            q = self.filter(project=project).filter(dataset=None)
        else:
            raise Exception("either a dataset or a project must be passed in")

        if aggregation_type not in ['count', 'array_agg']:
            raise Exception(
                "aggregation_type must be either count or array_agg")
        if ordering_field:
            q = q.order_by(ordering_field)
        return self._append_extras(q, aggregation_type)

    def get_objects_with_counts(
            self, dataset=None, project=None, ordering_field=None):
        return self._get_objects_with_extras(
            'count', dataset=dataset, project=project, ordering_field=ordering_field
        )

    def get_objects_with_lists(
            self, dataset=None, project=None, ordering_field=None):
        return self._get_objects_with_extras(
            'array_agg', dataset=dataset, project=project,
            ordering_field=ordering_field
        )

    def _append_extras(self, q, sql_function):
        # Excellent resource on using extras:
        # http://timmyomahony.com/blog/2012/11/16/filtering-annotations-django/
        from localground.apps.site import models
        # should either be "count" or "array"
        suffix = sql_function.split("_")[0]
        content_type_id = q.model.get_content_type().id
        table_name = q.model._meta.db_table

        child_classes = [
            models.Photo, models.Audio, models.MapImage, models.Video]

        # build a custom query that includes child counts:
        # Note: subquery needed to preserve media ordering
        select = {}
        for cls in child_classes:
            select[cls.model_name + '_' + suffix] = '''
                SELECT %s(entity_id)
                FROM (
                    SELECT * FROM site_genericassociation
                    ORDER BY source_type_id, entity_type_id, ordering
                ) as e
                WHERE e.entity_type_id = %s AND e.source_type_id = %s AND
                e.source_id = %s.id
                ''' % (
                    sql_function, cls.get_content_type().id, content_type_id,
                    table_name
                )
        return q.extra(select)

    def get_objects_public_with_counts(
            self,
            datasets=None,
            project=None,
            access_key=None,
            ordering_field=None):
        q = self.get_objects_public(
            access_key=access_key,
            ordering_field=ordering_field)
        return self._append_extras(q, "count", project=project, datasets=datasets)

    def get_objects_public_with_lists(
            self,
            datasets=None,
            project=None,
            access_key=None,
            ordering_field=None):
        q = self.get_objects_public(
            access_key=access_key,
            ordering_field=ordering_field)
        return self._append_extras(
            q, "array_agg", project=project, datasets=datasets)

    def to_dict_list(self):
        # does this need to be implemented, or can we just rely on
        # the MarkerSerializer in the API?
        return []


class MarkerManager(GeoManager, ObjectMixin, MarkerMixin):
    pass
