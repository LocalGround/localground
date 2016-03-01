from django.contrib.gis.db import models
from localground.apps.site.models.abstract.audit import BaseAudit
from django.contrib.postgres.fields import ArrayField


class BaseNamed(BaseAudit):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = ArrayField(models.TextField(), default=list)
    #tags = ArrayField(models.CharField(max_length=200), default=list) 

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_form
        return get_inline_form(cls, user)

    class Meta:
        app_label = 'site'
        abstract = True
