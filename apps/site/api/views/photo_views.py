from rest_framework import viewsets, status
from localground.apps.site.api import serializers
from localground.apps.site.api.views.abstract_views import AuditUpdate
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from rest_framework.response import Response
from rest_framework.decorators import api_view

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
		if self.request.user.is_authenticated():
			return models.Photo.objects.get_objects(self.request.user)
		else:
			return models.Photo.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)

	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)

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
	

