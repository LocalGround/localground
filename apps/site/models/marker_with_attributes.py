from django.contrib.gis.db import models
from localground.apps.site.models import ObjectTypes
from datetime import datetime
from localground.apps.site.managers import MarkerManager
from django.contrib.contenttypes import generic
from localground.apps.site.models import PointMixin, ExtrasMixin, \
    NamedMixin, GenericRelationMixin, ProjectMixin, BaseAudit
from django.contrib.postgres.fields import HStoreField


class MarkerWithAttributes(ExtrasMixin, PointMixin, ProjectMixin, NamedMixin,
             GenericRelationMixin, BaseAudit):
    """
    Markers are association objects with a geometry (either point,
    line, or polygon).  Markers can be associated with one or more photos,
    audio files, data records, etc.  This object needs
    to be re-factored to inherit from account/Group Model, since it's an
    association of other media objects (and should behave like a project or a view).
    """
    polyline = models.LineStringField(blank=True, null=True)
    polygon = models.PolygonField(blank=True, null=True)
    form = models.ForeignKey('Form')

    objects = MarkerManager()
    filter_fields = ('id', 'project', 'name', 'description', 'tags',)
    attributes = HStoreField(default={})

    class Meta:
        verbose_name = 'marker with attributes'
        verbose_name_plural = 'marker with attributes'
        ordering = ['id']
        app_label = 'site'

    @property
    def geometry(self):
        return self.point or self.polyline or self.polygon

    def get_name(self):
        if self.name is None or len(self.name) == 0:
            return 'Marker #%s' % (self.id)
        return self.name

    def __unicode__(self):
        return str(self.id)