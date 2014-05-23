from django.contrib.gis.db import models
from localground.apps.site.models import BaseNamed
from localground.apps.site.managers import PresentationManager
from localground.apps.site.models.permissions import BasePermissions

class Presentation(BaseNamed, BasePermissions):
	code = models.TextField(null=True, blank=True)
	slug = models.SlugField(verbose_name="Friendly URL", max_length=100, db_index=True,
				help_text='A few words, separated by dashes "-", to be used as part of the url')
	objects = PresentationManager()