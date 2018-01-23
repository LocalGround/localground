from django.contrib.gis.db import models
from localground.apps.site.models import ObjectTypes
from datetime import datetime
from localground.apps.site.managers import MarkerManager
from django.contrib.contenttypes import generic
from localground.apps.site.models import PointMixin, ExtrasMixin, \
    NamedMixin, GenericRelationMixin, ProjectMixin, BaseAudit
from django.contrib.postgres.fields import HStoreField


class Record(ExtrasMixin, PointMixin, ProjectMixin, NamedMixin,
             GenericRelationMixin, BaseAudit):
    """
    Records are association objects with a geometry (either point,
    line, or polygon).  Records can be associated with one or more photos,
    audio files, data records, etc.  This object needs
    to be re-factored to inherit from account/Group Model, since it's an
    association of other media objects (and should behave like a project or a view).
    """
    polyline = models.LineStringField(blank=True, null=True)
    polygon = models.PolygonField(blank=True, null=True)
    form = models.ForeignKey('Form', null=True)

    objects = MarkerManager()
    filter_fields = ('id', 'project', 'name', 'description', 'tags',)
    attributes = HStoreField(default={})

    class Meta:
        verbose_name = 'record'
        verbose_name_plural = 'records'
        ordering = ['id']
        app_label = 'site'

    @property
    def geometry(self):
        return self.point or self.polyline or self.polygon

    def get_name(self):
        if self.name is None or len(self.name) == 0:
            return 'Record #%s' % (self.id)
        return self.name

    def __unicode__(self):
        return str(self.id)
    