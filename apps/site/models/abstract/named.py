from django.contrib.gis.db import models
from localground.apps.site.models.abstract.audit import BaseAudit
from tagging_autocomplete.models import TagAutocompleteField


class BaseNamed(BaseAudit):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = TagAutocompleteField(blank=True, null=True)

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_form
        return get_inline_form(cls, user)

    class Meta:
        app_label = 'site'
        abstract = True
