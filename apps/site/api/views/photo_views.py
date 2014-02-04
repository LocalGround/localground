from rest_framework import viewsets, status
from rest_framework import generics
from localground.apps.site.api import serializers, filters
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from rest_framework.response import Response
from rest_framework.decorators import api_view
		
class PhotoList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.PhotoSerializer
	filter_backends = (filters.SQLFilterBackend,)
	
	def get_queryset(self):
		if self.request.user.is_authenticated():
			return models.Photo.objects.get_objects(self.request.user)
		else:
			return models.Photo.objects.get_objects_public(
				access_key=self.request.GET.get('access_key')
			)
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		
		#save uploaded image to file system
		f = self.request.FILES['file_name_orig']
		project = models.Project.objects.get(id=self.request.DATA.get('project_id'))
		obj.save_upload(f, self.request.user, project, do_save=False)
	
		
class PhotoInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Photo.objects.select_related('owner').all()
	serializer_class = serializers.PhotoSerializer
	
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
	

