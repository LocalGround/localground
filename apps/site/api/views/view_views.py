from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import \
	AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models
from localground.apps.site.api.permissions import CheckProjectPermissions
from django.db.models import Q


class ViewList(QueryableListCreateAPIView, AuditCreate):
	serializer_class = serializers.ViewSerializer
	filter_backends = (filters.SQLFilterBackend,)
	model = models.View
	paginate_by = 100
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return self.model.objects.get_objects(self.request.user)
		else:
			return self.model.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		obj.access_authority = models.ObjectAuthority.objects.get(id=1)

	
class ViewInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.View.objects.select_related('owner').all()
	serializer_class = serializers.ViewDetailSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		