from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base
from localground.apps.site.models.lookups import ReturnCodes

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

class ExtentsMixin(models.Model):

    """
    abstract class for uploads with lat/lng references.
    """
    extents = models.PolygonField(null=True, blank=True)

    class Meta:
        abstract = True

    def remove_extents(self, user):
        try:
            if self.can_edit(user):
                self.extents = None
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR
