from rest_framework import generics, exceptions, viewsets, status, permissions
from rest_framework.decorators import api_view #, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse

from localground.apps.site.api import serializers
#from localground.apps.site.api.permissions import IsAllowedGivenProjectPermissionSettings
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from django.contrib.auth.models import User, Group

from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site.api.views.scan_views import ScanViewSet
from localground.apps.site.api.views.print_views import PrintList, PrintInstance, LayoutViewSet
from localground.apps.site.api.views.project_views import ProjectList, ProjectInstance
from localground.apps.site.api.views.marker_views import MarkerList, MarkerInstance
from localground.apps.site.api.views.association_views import (
	RelatedMediaList, RelatedMediaInstance
)
from localground.apps.site.api.views.ebays_views import TrackList
from localground.apps.site.api.views.form_views import (
	FormList, FormInstance, FormDataList, FormDataInstance
)
from localground.apps.site.api.views.admin_views import (
	TileViewSet, OverlayTypeViewSet, OverlaySourceViewSet,
	UserViewSet, GroupViewSet, DataTypeViewSet
)


@api_view(('GET',))
def api_root(request, format=None, **kwargs):
	from django.utils.datastructures import SortedDict
	d = SortedDict()
	d['audio'] = reverse('audio-list', request=request, format=format)
	d['forms'] = reverse('form-list', request=request, format=format)
	d['groups'] = reverse('group-list', request=request, format=format)
	d['layouts'] = reverse('layout-list', request=request, format=format)
	d['data-types'] = reverse('datatype-list', request=request, format=format)
	d['markers'] = reverse('marker-list', request=request, format=format)
	d['map-images'] = reverse('scan-list', request=request, format=format)
	d['overlay-sources'] = reverse('overlaysource-list', request=request, format=format)
	d['overlay-types'] = reverse('overlaytype-list', request=request, format=format)
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
	serializer_class = serializers.PhotoSerializer
	filter_backends = (SQLFilterBackend,)
	model = models.Photo

	def get_queryset(self):
		return models.Photo.objects.get_objects(self.request.user)

	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
from rest_framework.decorators import api_view

@api_view(['PUT', 'PATCH', 'GET'])
def rotate_left(request, pk, format='html'):
	try:
		photo = models.Photo.objects.get(id=pk)
		photo.rotate_left(request.user)
		return Response(serializers.PhotoSerializer(photo).data,
			status=status.HTTP_200_OK)
	except models.Photo.DoesNotExist:
		return Response({"error": "Photo #%s not found on the server" % pk}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT', 'PATCH'])
def rotate_right(request, pk, format='html'):
	try:
		photo = models.Photo.objects.get(id=pk)
		photo.rotate_right(request.user)
		return Response(serializers.PhotoSerializer(photo).data,
			status=status.HTTP_200_OK)
	except models.Photo.DoesNotExist:
		return Response({"error": "Photo #%s not found on the server" % pk}, status=status.HTTP_404_NOT_FOUND)
	


		
class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
	"""
	This viewset automatically provides `list` and `detail` actions.
	"""
	serializer_class = serializers.AudioSerializer
	filter_backends = (SQLFilterBackend,)
	model = models.Audio

	def get_queryset(self):
		return models.Audio.objects.get_objects(self.request.user)
	
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
		