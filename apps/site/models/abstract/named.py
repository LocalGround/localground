from django.contrib.gis.db import models
from localground.apps.site.models.abstract.audit import BaseAudit
from django.contrib.postgres.fields import ArrayField


class BaseNamed(BaseAudit):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = ArrayField(models.TextField(), default=list)

    class Meta:
        app_label = 'site'
        abstract = True
