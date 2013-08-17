from django.contrib.gis.db import models

class ProjectMixin(models.Model):
	RESTRICT_BY_PROJECT = True
	project = models.ForeignKey('Project', related_name='%(class)s')
	
	class Meta:
		abstract = True
	
class BaseGenericRelationMixin(models.Model):
	from django.contrib.contenttypes import generic
	
	entities = generic.GenericRelation('GenericAssociation',
									   content_type_field='source_type',
									   object_id_field='source_id',
									   related_name="%(app_label)s_%(class)s_related_entity")
	
	class Meta:
		abstract = True
	
	@property
	def photos(self):
		from localground.apps.site.models.photo import Photo
		return self._get_filtered_entities(Photo)    
	
	@property
	def audio(self):
		from localground.apps.site.models.audio import Audio
		return self._get_filtered_entities(Audio)
	
	@property
	def videos(self):
		from localground.apps.site.models.video import Video
		return self._get_filtered_entities(Video)
	
	@property
	def map_images(self):
		from localground.apps.site.models.scan import Scan
		return self._get_filtered_entities(Scan)
		
	@property
	def markers(self):
		from localground.apps.site.models.marker import Marker
		return self._get_filtered_entities(Marker)
	