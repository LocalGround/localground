from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models
from localground.apps.site.api.permissions import IsAllowedGivenProjectPermissionSettings
from django.db.models import Q


class ProjectList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.ProjectSerializer
	filter_backends = (filters.SQLFilterBackend,)

	paginate_by = 100
	
	def get_queryset(self):
		user = self.request.user
		return (models.Project.objects.distinct()
					.select_related('owner', 'last_updated_by')
					.filter(Q(owner=user) | Q(users__user=user))
				)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		obj.access_authority = models.ObjectAuthority.objects.get(id=1)
	
class ProjectInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Project.objects.select_related('owner').all()
	serializer_class = serializers.ProjectDetailSerializer
	permission_classes = (IsAllowedGivenProjectPermissionSettings, )
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		