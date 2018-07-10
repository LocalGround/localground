from django.contrib.gis.db import models
from localground.apps.site.models import Base


class DataType(Base):

    class DataTypes():
        '''
        Enum for simplifying field type lookups
        '''
        # TODO: Hardcoding in DB = BAD
        TEXT = 1
        INTEGER = 2
        DATETIME = 3
        BOOLEAN = 4
        DECIMAL = 5
        RATING = 6
        CHOICE = 7
        PHOTO = 8
        AUDIO = 9

    name = models.CharField(max_length=255, editable=False)
    sql = models.CharField(max_length=500, editable=False)

    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            sql=self.sql
        )

    def __str__(self):
        return self.__unicode__()

    def __repr__(self):
        return self.__unicode__()

    class Meta:
        app_label = 'site'
        verbose_name = 'data-type'
        verbose_name_plural = 'data-types'
        ordering = ['name']
