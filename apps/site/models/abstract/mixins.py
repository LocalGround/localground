from django.contrib.gis.db import models
from jsonfield import JSONField


class ProjectMixin(models.Model):
    project = models.ForeignKey('Project', related_name='%(class)s+')

    class Meta:
        abstract = True
        
class ExtrasMixin(models.Model):
    extras = JSONField(blank=True, null=True)
    
    class Meta:
        abstract = True
        
class BasePointMixin(models.Model):
    point = models.PointField(blank=True, null=True)
    
    @property
    def geometry(self):
        return self.point

    class Meta:
        abstract = True

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
        try:
            if self.can_edit(user):
                self.point = Point(lng, lat, srid=4326)
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR

    def remove_latlng(self, user):
        try:
            if self.can_edit(user):
                self.point = None
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR

    def __unicode__(self):
        return self.display_coords()


class BaseGenericRelationMixin(models.Model):
    from django.contrib.contenttypes import fields
    _photos = None
    _audio = None
    _map_images = None
    _markers = None

    entities = fields.GenericRelation(
        'GenericAssociation',
        content_type_field='source_type',
        object_id_field='source_id',
        related_query_name="%(app_label)s_%(class)s_related_entity")

    class Meta:
        abstract = True

    @property
    def photos(self):
        if self._photos is None:
            from localground.apps.site.models.photo import Photo
            self._photos = self._get_filtered_entities(Photo)
        return self._photos

    @property
    def audio(self):
        if self._audio is None:
            from localground.apps.site.models.audio import Audio
            self._audio = self._get_filtered_entities(Audio)
        return self._audio

    @property
    def videos(self):
        if self._videos is None:
            from localground.apps.site.models.video import Video
            self._videos = self._get_filtered_entities(Video)
        return self._videos

    @property
    def map_images(self):
        if self._map_images is None:
            from localground.apps.site.models.mapimage import MapImage
            self._map_images = self._get_filtered_entities(MapImage)
        return self._map_images

    @property
    def markers(self):
        if self._markers is None:
            from localground.apps.site.models.marker import Marker
            self._markers = self._get_filtered_entities(Marker)
        return self._markers
