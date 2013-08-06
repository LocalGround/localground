from django.contrib.gis.db import models

class ProjectMixin(models.Model):
	RESTRICT_BY_PROJECT = True
	project = models.ForeignKey('Project', related_name='%(class)s')
	
	class Meta:
		abstract = True
	