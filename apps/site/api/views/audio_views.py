from rest_framework import viewsets
from localground.apps.site.api import serializers
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from localground.apps.site.api.views.abstract_views import AuditUpdate

class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
	"""
	This viewset automatically provides `list` and `detail` actions.
	"""
	serializer_class = serializers.AudioSerializer
	filter_backends = (SQLFilterBackend,)
	model = models.Audio

	def get_queryset(self):
		if self.request.user.is_authenticated():
			return models.Audio.objects.get_objects(self.request.user)
		else:
			return models.Audio.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		