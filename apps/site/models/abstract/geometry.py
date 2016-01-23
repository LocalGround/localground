from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base


class BaseExtents(Base):

    """
    abstract class for uploads with lat/lng references.
    """
    extents = models.PolygonField()
    northeast = models.PointField()
    southwest = models.PointField()
    center = models.PointField()
    zoom = models.IntegerField()

    class Meta:
        abstract = True

    def display_coords(self):
        if self.northeast is not None and self.southwest:
            try:
                return 'Northeast: (%0.4f, %0.4f), Southwest: (%0.4f, %0.4f)' % (
                    self.northeast.y, self.northeast.x, self.southwest.x, self.southwest.x)
            except ValueError:
                return 'String Format Error: (%s, %s)' % (
                    str(self.point.y), str(self.point.x))
        return '(?, ?)'

    def update_extents(self, northeast_lat, northeast_lng,
                       southwest_lat, southwest_lng, user):
        '''Tries to update lat/lng, returns code'''
        from django.contrib.gis.geos import Point
        try:
            if self.can_edit(user):
                self.northeast = Point(northeast_lng, northeast_lat, srid=4326)
                self.southwest = Point(southwest_lng, southwest_lat, srid=4326)
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR

    def remove_extents(self, user):
        try:
            if self.can_edit(user):
                self.northeast = None
                self.southwest = None
                self.last_updated_by = user
                self.save()
                return ReturnCodes.SUCCESS
            else:
                return ReturnCodes.UNAUTHORIZED
        except Exception:
            return ReturnCodes.UNKNOWN_ERROR

    def __unicode__(self):
        return self.display_coords()

