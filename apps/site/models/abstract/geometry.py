from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base


class BaseExtents(Base):

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

