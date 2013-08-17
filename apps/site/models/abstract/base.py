from django.contrib.gis.db import models
from django.http import Http404
from localground.apps.lib.helpers import classproperty
from django.contrib.contenttypes.models import ContentType
		
class Base(models.Model):
	RESTRICT_BY_PROJECT = False
	RESTRICT_BY_USER = False
	class Meta:
		app_label = 'site'
		abstract = True
		verbose_name = 'base'
		verbose_name_plural = 'bases'
		
	@classmethod
	def get_model(cls, model_name=None, model_name_plural=None):
		'''
		Finds the corresponding model class, based on the arguments
		'''
		if model_name is None and model_name_plural is None:
			raise Exception('Either model_name or model_name_plural is required here.')

		from django.db.models import loading
		models = loading.get_models()
		if model_name_plural:
			#model_name_plural = model_name_plural.replace('-', ' ')
			for m in models:
				try:
					if model_name_plural == m.model_name_plural:
						return m
				except:
					pass
		if model_name:
			#model_name = model_name.replace('-', ' ')
			for m in models:
				try:
					if model_name == m.model_name:
						return m
				except:
					pass
		raise Http404
	
	@classproperty
	def model_name(cls):
		return cls._meta.verbose_name
	
	@classproperty
	def model_name_plural(cls):
		return cls._meta.verbose_name_plural
										  
	@classmethod
	def listing_url(cls):
		return '/profile/{0}/'.format(cls.model_name_plural)
		
	@classmethod
	def batch_delete_url(cls):
		return '/profile/{0}/delete/batch/'.format(cls.model_name_plural)
		
	@classmethod
	def create_url(cls):
		return '/profile/{0}/create/'.format(cls.model_name_plural)

	def update_url(self):
		return '/profile/{0}/{1}/update/'.format(self.model_name_plural, self.id)
		
	def delete_url(self):
		#use the API to delete:
		return '/api/0/{0}/{1}/'.format(self.model_name_plural, self.id)
	
	@classmethod
	def get_content_type(cls):
		'''
		Finds the ContentType of the model (does a database query)
		'''
		return ContentType.objects.get_for_model(cls)
	

	def stash(self, *args, **kwargs):
		# same as append
		self.append(*args, **kwargs)
		
	def grab(self, cls):
		# same as _get_filtered_entities
		return self._get_filtered_entities(cls)
		
	def _get_filtered_entities(self, cls):
		"""
		Private method that queries the GenericAssociation model for
		references to the current view for a given media type (Photo,
		Audio, Video, Scan, Marker).
		"""
		qs = (self.entities
				.filter(entity_type=cls.get_content_type())
				.prefetch_related('entity_object', 'entity_object__owner')
				.order_by('ordering',))
		entities = []
		for rec in list(qs):
			o = rec.entity_object
			o.ordering = rec.ordering
			o.turned_on = rec.turned_on
			entities.append(o)
		return entities
	
	def append(self, item, user, ordering=1, turned_on=False):
		'''
		Creates an association between the object and whatever the item specified
		"ordering" and "turned_on" args are optional.
		'''
		from localground.apps.site.models import GenericAssociation
		
		if not issubclass(item.__class__, BaseUploadedMedia):
			raise Exception('Only items of type Photo, Audio, or Record can be appended.')
		
		assoc = GenericAssociation(
			source_type=self.get_content_type(),
			source_id=self.id,
			entity_type=item.get_content_type(),
			entity_id=item.id,
			ordering=ordering,
			turned_on=turned_on,
			owner=user,
			last_updated_by=user,
			date_created=datetime.now(),
			time_stamp=datetime.now()
		)
		assoc.save() 