from django.contrib.gis.db import models
from jsonfield import JSONField
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.postgres.fields import ArrayField
from localground.apps.lib.helpers import upload_helpers

import operator
'''
This file contains the following mixins:
    * PointMixin
    * ExtentsMixin
    * ProjectMixin
    * ExtrasMixin
    * BaseGenericRelationMixin
    * BaseMediaMixin
'''


class PointMixin(models.Model):
    point = models.PointField(blank=True, null=True)

    class Meta:
        abstract = True

    @property
    def geometry(self):
        return self.point

    def display_coords(self):
        if self.point is not None:
            try:
                return '(%0.4f, %0.4f)' % (self.point.y, self.point.x)
            except ValueError:
                return 'String Format Error: (%s, %s)' % (
                    str(self.point.y), str(self.point.x))
        return '(?, ?)'

    def update_latlng(self, lat, lng, user):
        '''Tries to update lat/lng, returns code'''
        from django.contrib.gis.geos import Point
        self.point = Point(lng, lat, srid=4326)
        self.last_updated_by = user
        self.save()

    def remove_latlng(self, user):
        self.point = None
        self.last_updated_by = user
        self.save()

    def __unicode__(self):
        return self.display_coords()


class ExtentsMixin(models.Model):
    """
    abstract class for uploads with lat/lng references.
    """
    extents = models.PolygonField(null=True, blank=True)

    class Meta:
        abstract = True

    @property
    def geometry(self):
        return self.extents

    def remove_extents(self, user):
        self.extents = None
        self.last_updated_by = user
        self.save()


class ProjectMixin(models.Model):
    project = models.ForeignKey('Project', related_name='%(class)s+')

    def can_view(self, user=None, access_key=None):
        return self.owner == user or \
            self.project.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return user == self.owner or \
            self.project.can_edit(user)

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

        # SQL sort doesn't seem to be working, so sorting via python:
        objects = sorted(objects, key=operator.attrgetter('ordering'))
        return objects

    def stash(self, item, user, ordering=1, turned_on=False):
        '''
        Creates an association between the object and whatever the item
        specified "ordering" and "turned_on" args are optional.
        '''
        from localground.apps.site.models import GenericAssociation
        from localground.apps.site.models.abstract.base import \
            BaseUploadedMedia
        from localground.apps.lib.helpers import get_timestamp_no_milliseconds

        if not issubclass(item.__class__, BaseUploadedMedia):
            raise Exception(
                'Only items of type Photo, Audio, Record, or Map Image \
                can be appended.')

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


class BaseNamedMixin(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = ArrayField(models.TextField(), default=list)

    class Meta:
        app_label = 'site'
        abstract = True


class BaseMediaMixin(models.Model):
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50)

    '''
    Important: The "groups" generic relation is needed to ensure cascading
    deletes.  For example, if a photo gets deleted, you also want to ensure
    that its associations w/any markers / views also get deleted.  The reverse
    relationship needs to be defined here in order for this to occur:
    http://stackoverflow.com/questions/6803018/why-wont-my-genericforeignkey-cascade-when-deleting
    '''
    groups = GenericRelation(
        'GenericAssociation',
        content_type_field='entity_type',
        object_id_field='entity_id',
        related_query_name="%(app_label)s_%(class)s_related"
    )
    filter_fields = ('id', 'project', 'date_created', 'file_name_orig',)

    class Meta:
        abstract = True
        app_label = 'site'

    def get_absolute_path(self):
        return upload_helpers.get_absolute_path(self.virtual_path)

    def absolute_virtual_path(self):
        return upload_helpers.encrypt_media_path(
            self.host,
            self.model_name_plural,
            self.virtual_path + self.file_name_new
        )

    def absolute_virtual_path_orig(self):
        return upload_helpers.encrypt_media_path(
            self.host,
            self.model_name_plural,
            self.virtual_path + self.file_name_orig
        )

    def generate_relative_path(self):
        return upload_helpers.generate_relative_path(
            self.owner, self.model_name_plural
        )

    def generate_absolute_path(self):
        return upload_helpers.generate_absolute_path(
            self.owner, self.model_name_plural
        )

    def _encrypt_media_path(self, path, host=None):
        return upload_helpers.encrypt_media_path(
            self.host, self.model_name_plural, path
        )

    def encrypt_url(self, file_name):
        # return self.virtual_path + file_name
        return self._encrypt_media_path(self.virtual_path + file_name)

    @classmethod
    def make_directory(cls, path):
        upload_helpers.make_directory(path)
