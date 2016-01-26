from django.contrib.gis.db import models
from localground.apps.site.models import ObjectTypes
from datetime import datetime
from localground.apps.site.managers import MarkerManager
from localground.apps.site.models import BaseUploadedMedia
from django.contrib.contenttypes import generic
from localground.apps.site.models import BasePointMixin, ExtrasMixin, BaseNamed, \
    BaseGenericRelationMixin, ReturnCodes

class Marker(ExtrasMixin, BasePointMixin, BaseNamed, BaseGenericRelationMixin):

    """
    Markers are association objects with a geometry (either point,
    line, or polygon).  Markers can be associated with one or more photos,
    audio files, data records, etc.  This object needs
    to be re-factored to inherit from account/Group Model, since it's an
    association of other media objects (and should behave like a project or a view).
    """
    project = models.ForeignKey('Project')
    polyline = models.LineStringField(blank=True, null=True)
    polygon = models.PolygonField(blank=True, null=True)

    # todo:  replace project with generic association to either a project, view,
    # or presentation :)
    color = models.CharField(max_length=6)
    _records_dict = None
    objects = MarkerManager()
    filter_fields = ('id', 'project', 'name', 'descrption', 'tags',)

    @property
    def geometry(self):
        return self.point or self.polyline or self.polygon

    @classmethod
    def create_instance(user, project, lat, lng, name=None):
        try:
            from django.contrib.gis.geos import Point
            marker = Marker()
            marker.project = project
            marker.owner = user
            marker.color = 'CCCCCC'
            marker.last_updated_by = user
            marker.point = Point(lng, lat, srid=4326)
            if name is not None:
                marker.name = name
            marker.save()
            return marker, ReturnCodes.SUCCESS
        except Exception:
            return None, ReturnCodes.UNKNOWN_ERROR

    def get_name(self):
        if self.name is None or len(self.name) == 0:
            return 'Marker #%s' % (self.id)
        return self.name

    def get_records(self, forms=None):
        """
        Gets all of the records in the marker.
        """
        from django.contrib.contenttypes.models import ContentType
        from localground.apps.site import models

        if self._records_dict is None:
            # query for forms and form content types if they're null:
            if forms is None:
                forms = (models.Form.objects
                         #.select_related('project')
                         .prefetch_related('field_set', 'field_set__data_type', 'projects')
                         .filter(projects=obj.project)
                         )
                table_models = [form.TableModel for form in forms]
                ContentType.objects.get_for_models(
                    *table_models,
                    concrete_model=False)

            self._records_dict = {}
            for form in forms:
                cls = form.TableModel
                recs = self._get_filtered_entities(cls)
                if len(recs) > 0:
                    self._records_dict[form] = recs

        return self._records_dict

    def can_view(self, user, access_key=None):
        return self.project.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.project.can_edit(user)

    class Meta:
        verbose_name = 'marker'
        verbose_name_plural = 'markers'
        ordering = ['id']
        app_label = 'site'

    def __unicode__(self):
        return str(self.id)
