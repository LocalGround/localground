from django.contrib.gis.db import models
from localground.apps.site.models import Base

class DataType(Base):
    name = models.CharField(max_length=255)
    sql = models.CharField(max_length=500)
    
    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            sql=self.sql
        )
    
    def __str__(self):
        return self.name
    
    def __repr__(self):
        return self.name
    
    class Meta:
        app_label = 'site'
        verbose_name = 'data-type'
        verbose_name_plural = 'data-types'
        ordering = ['name']
