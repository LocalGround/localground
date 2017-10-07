from django.contrib.gis.db import models
from jsonfield import JSONField
import operator


class ProjectMixin(models.Model):
    project = models.ForeignKey('Project', related_name='%(class)s+')

    class Meta:
        abstract = True

class ExtrasMixin(models.Model):
    extras = JSONField(blank=True, null=True)

    class Meta:
        abstract = True


class BaseGenericRelationMixin(models.Model):
    from django.contrib.contenttypes import fields

    entities = fields.GenericRelation(
        'GenericAssociation',
        content_type_field='source_type',
        object_id_field='source_id',
        related_query_name="%(app_label)s_%(class)s_related_entity")

    class Meta:
        abstract = True

    def grab(self, cls):
        """
        Private method that queries the GenericAssociation model for
        references to the current view for a given media type (Photo,
        Audio, Video, MapImage, Marker).
        """
        qs = (self.entities
              .filter(entity_type=cls.get_content_type())
              .order_by('ordering',))
        ids = [rec.entity_id for rec in qs]
        related_fields = ['owner']
        if hasattr(cls, 'project'):
            related_fields.extend(['project', 'project__owner'])
        objects = cls.objects.select_related(*related_fields).filter(
            id__in=ids)

        entities = []
        stale_references = []
        for rec in qs:
            found = False
            for o in objects:
                if rec.entity_id == o.id:
                    found = True
                    o.ordering = rec.ordering
                    o.turned_on = rec.turned_on
                    break
            if not found:
                stale_references.append(rec.id)

        # Because the ContentTypes framework doesn't use traditional relational
        # database controls (no constraints), it's possible that the referenced
        # objects no longer exist.  If this is the case, delete the irrelevant
        # pointers:
        if len(stale_references) > 0:
            self.entities.filter(id__in=stale_references).delete()

        #SQL sort doesn't seem to be working, so sorting via python:
        objects = sorted(objects, key=operator.attrgetter('ordering'))
        return objects

    def stash(self, item, user, ordering=1, turned_on=False):
        '''
        Creates an association between the object and whatever the item specified
        "ordering" and "turned_on" args are optional.
        '''
        from localground.apps.site.models import GenericAssociation
        from localground.apps.site.models.abstract.media import BaseUploadedMedia
        from localground.apps.lib.helpers import get_timestamp_no_milliseconds

        if not issubclass(item.__class__, BaseUploadedMedia):
            raise Exception(
                'Only items of type Photo, Audio, Record, or Map Image can be appended.')

        assoc = GenericAssociation(
            source_type=self.get_content_type(),
            source_id=self.id,
            entity_type=item.get_content_type(),
            entity_id=item.id,
            ordering=ordering,
            turned_on=turned_on,
            owner=user,
            last_updated_by=user,
            date_created=get_timestamp_no_milliseconds(),
            time_stamp=get_timestamp_no_milliseconds()
        )
        assoc.save()

    @property
    def photos(self):
        from localground.apps.site.models.photo import Photo
        return self.grab(Photo)

    @property
    def audio(self):
        from localground.apps.site.models.audio import Audio
        return self.grab(Audio)

    @property
    def videos(self):
        from localground.apps.site.models.video import Video
        return self.grab(Video)

    @property
    def map_images(self):
        from localground.apps.site.models.mapimage import MapImage
        return self.grab(MapImage)

    @property
    def markers(self):
        from localground.apps.site.models.marker import Marker
        return self.grab(Marker)
