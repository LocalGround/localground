from django.contrib.gis.db import models
from localground.apps.site.models import BaseNamed
from localground.apps.site.managers import PresentationManager
from localground.apps.site.models.permissions import BasePermissions
from jsonfield import JSONField

class Presentation(BaseNamed, BasePermissions):
    code = JSONField(blank=True, null=True)
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", to be used as part of the url')
    objects = PresentationManager()

    def to_dict(self, detailed=False):
        from localground.apps.site.api.serializers import PresentationSerializer

        if detailed:
            return PresentationSerializer(self, context={'request': {}}).data
        return PresentationSerializer(self, context={'request': {}}).data
