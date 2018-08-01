from django.contrib.gis.db import models
from localground.apps.site.models import ObjectTypes
from datetime import datetime
from localground.apps.site.managers import MarkerManager
from django.contrib.contenttypes import generic
from localground.apps.site.models import PointMixin, ExtrasMixin, \
    NamedMixin, GenericRelationMixin, ProjectMixin, BaseAudit
from django.contrib.postgres.fields import HStoreField
from django.contrib.postgres.fields import ArrayField


class Record(ExtrasMixin, PointMixin, ProjectMixin,
             GenericRelationMixin, BaseAudit):
    """
    Records are association objects with a geometry (either point,
    line, or polygon).  Records can be associated with one or more photos,
    audio files, data records, etc.  This object needs to be
    re-factored to inherit from account/Group Model, since it's an association
    of other media objects (and should behave like a project or a view).
    """
    tags = ArrayField(models.TextField(), default=list)
    polyline = models.LineStringField(blank=True, null=True)
    polygon = models.PolygonField(blank=True, null=True)
    dataset = models.ForeignKey('Dataset', null=True)

    objects = MarkerManager()
    filter_fields = ('id', 'project', 'tags',)
    attributes = HStoreField(default={})

    class Meta:
        verbose_name = 'record'
        verbose_name_plural = 'records'
        ordering = ['id']
        app_label = 'site'

    @property
    def geometry(self):
        return self.point or self.polyline or self.polygon

    def __unicode__(self):
        return str(self.id)

    def get_media_siblings(self, media_content_type_id):
        # If the instance is an audio association, only re-sort
        # sibling audio instances. If the instance is either video or photo,
        # then siblings = video + audio (b/c they're in the same carousel):
        from localground.apps.site.models import Audio
        if media_content_type_id == Audio.get_content_type().id:
            return self._get_audio_siblings()
        return self._get_photo_and_video_siblings()

    def _get_photo_and_video_siblings(self):
        from localground.apps.site.models import Photo, Video
        return list(self.entities.filter(
            entity_type_id__in=[
                Photo.get_content_type().id, Video.get_content_type().id
            ]).order_by('ordering',))

    def _get_audio_siblings(self):
        from localground.apps.site.models import Audio
        return list(self.entities.filter(
            entity_type_id=Audio.get_content_type().id
        ).order_by('ordering',))
