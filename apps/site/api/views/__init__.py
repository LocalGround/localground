from rest_framework import generics, exceptions, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse

from localground.apps.site.api import serializers
from localground.apps.site.api.permissions import IsAllowedGivenProjectPermissionSettings
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from django.contrib.auth.models import User, Group

from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site.api.views.print_views import PrintList, PrintInstance, LayoutViewSet
from localground.apps.site.api.views.project_views import ProjectList, ProjectInstance
from localground.apps.site.api.views.marker_views import MarkerList, MarkerInstance
from localground.apps.site.api.views.association_views \
					import RelatedMediaList, RelatedMediaInstance

@api_view(('GET',))
#@permission_classes((permissions.IsAuthenticated, IsAllowedGivenProjectPermissionSettings, ))
def api_root(request, format=None, **kwargs):
	from django.utils.datastructures import SortedDict
	d = SortedDict()
	d['audio'] = reverse('audio-list', request=request, format=format)
	d['groups'] = reverse('group-list', request=request, format=format)
	d['layouts'] = reverse('layout-list', request=request, format=format)
	d['markers'] = reverse('marker-list', request=request, format=format)
	d['overlaysources'] = reverse('overlaysource-list', request=request, format=format)
	d['overlaytypes'] = reverse('overlaytype-list', request=request, format=format)
	d['photos'] = reverse('photo-list', request=request, format=format)
	d['prints'] = reverse('print-list', request=request, format=format)
	d['projects'] = reverse('project-list', request=request, format=format)
	d['tiles'] = reverse('wmsoverlay-list', request=request, format=format)
	d['users'] = reverse('user-list', request=request, format=format)
	return Response(d)

class PhotoViewSet(viewsets.ModelViewSet, AuditUpdate):
	"""
	This viewset automatically provides `list`, `create`, `retrieve`,
	`update` and `destroy` actions.

	Additionally we also provide an extra `highlight` action. 
	"""
	queryset = models.Photo.objects.select_related('project', 'owner').all()
	serializer_class = serializers.PhotoSerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)

		
class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
	"""
	This viewset automatically provides `list` and `detail` actions.
	"""
	queryset = models.Audio.objects.select_related('project', 'owner').all()
	serializer_class = serializers.AudioSerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
		
class TileViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.WMSOverlay.objects.select_related('overlay_type', 'overlay_source').all()
	serializer_class = serializers.WMSOverlaySerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class OverlayTypeViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.OverlayType.objects.all()
	serializer_class = serializers.OverlayTypeSerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class OverlaySourceViewSet(viewsets.ModelViewSet, AuditUpdate):
	queryset = models.OverlaySource.objects.all()
	serializer_class = serializers.OverlaySourceSerializer
	filter_backends = (SQLFilterBackend,)
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
	
	
class UserViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows users to be viewed or edited.
	"""
	queryset = User.objects.all()
	serializer_class = serializers.UserSerializer

class GroupViewSet(viewsets.ModelViewSet):
	"""
	API endpoint that allows groups to be viewed or edited.
	"""
	queryset = Group.objects.all()
	serializer_class = serializers.GroupSerializer
