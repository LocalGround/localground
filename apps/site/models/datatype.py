from django.contrib.gis.db import models

class DataType(models.Model):
    name = models.CharField(max_length=255)
    sql = models.CharField(max_length=500)
    
    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            sql=self.sql
        )
 
    class Meta:
        app_label = 'site'
        ordering = ['name']
