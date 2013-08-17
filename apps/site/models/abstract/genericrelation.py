#!/usr/bin/env python
from django.contrib.gis.db import models
from datetime import datetime, timedelta
from localground.apps.site.models.abstract.named import BaseNamed
from localground.apps.site.models.abstract.mixins import BaseGenericRelationMixin

class BaseGenericRelations(BaseNamed, BaseGenericRelationMixin):
	class Meta:
		app_label = 'site'
		abstract = True
		
		
	