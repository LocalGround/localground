from rest_framework import viewsets, generics
from localground.apps.site.api import serializers, filters, permissions
from localground.apps.site.api.views.abstract_views import AuditCreate, AuditUpdate
from localground.apps.site import models
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from localground.apps.site.api.permissions import CheckFormPermissions

class FormList(generics.ListCreateAPIView, AuditCreate):
	serializer_class = serializers.FormSerializer
	filter_backends = (filters.SQLFilterBackend,)
	queryset = models.Form.objects.select_related('owner')

	paginate_by = 100
	
	def pre_save(self, obj):
		AuditCreate.pre_save(self, obj)
		
class FormInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
	queryset = models.Form.objects.select_related('owner')
	serializer_class = serializers.FormSerializer
	
	def pre_save(self, obj):
		AuditUpdate.pre_save(self, obj)
		
class FormDataMixin(object):
	
	def get_serializer_class(self):
		'''
		This serializer class gets build dynamically, according to the
		user-generated table being queried
		'''
		try:
			form = models.Form.objects.get(id=self.kwargs.get('form_id'))
		except models.Form.DoesNotExist:
			raise Http404
		if self.request.method == 'GET' and self.kwargs.get('format') != 'csv':
			return serializers.create_compact_record_serializer(form)
		else:
			return serializers.create_record_serializer(form)
	
	def get_queryset(self):
		try:
			form = models.Form.objects.get(id=self.kwargs.get('form_id'))
		except models.Form.DoesNotExist:
			raise Http404
		return form.get_objects(self.request.user)
	

class FormDataList(generics.ListCreateAPIView, FormDataMixin):
	filter_backends = (filters.SQLFilterBackend,)
	permission_classes = (CheckFormPermissions,)
	model = models.Form
	
	def pre_save(self, obj):
		obj.manually_reviewed = True
		
	def get_serializer_class(self):
		return FormDataMixin.get_serializer_class(self)
	
	#def get_queryset(self):
	#	return FormDataMixin.get_queryset(self)
	
	def get_queryset(self):
		try:
			form = models.Form.objects.get(id=self.kwargs.get('form_id'))
		except models.Form.DoesNotExist:
			raise Http404
		if self.request.user.is_authenticated():
			return form.TableModel.objects.get_objects(self.request.user)
		else:
			return form.TableModel.objects.get_objects_public(
				self.request.user, access_key=self.request.GET.get('access_key'))	
		
	def create(self, request, *args, **kwargs):
		'''
		Overriding this method so that the object's save method can pass
		in an argument (e.g.: obj.save(user=user)).  Todo:  move this into a
		base class
		'''
		serializer = self.get_serializer(data=request.DATA, files=request.FILES)

		if serializer.is_valid():
			self.pre_save(serializer.object)
			self.object = serializer.save(force_insert=True, user=request.user)
			self.post_save(self.object, created=True)
			headers = self.get_success_headers(serializer.data)
			return Response(serializer.data, status=status.HTTP_201_CREATED,
							headers=headers)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	

class FormDataInstance(generics.RetrieveUpdateDestroyAPIView, FormDataMixin):
	
	def get_serializer_class(self):
		return FormDataMixin.get_serializer_class(self)
	
	def get_queryset(self):
		return FormDataMixin.get_queryset(self)
		
	def update(self, request, *args, **kwargs):
		partial = kwargs.pop('partial', False)
		self.object = self.get_object_or_none()

		if self.object is None:
			created = True
			save_kwargs = {'force_insert': True}
			success_status_code = status.HTTP_201_CREATED
		else:
			created = False
			save_kwargs = {'force_update': True}
			success_status_code = status.HTTP_200_OK

		serializer = self.get_serializer(self.object, data=request.DATA,
										 files=request.FILES, partial=partial)
		save_kwargs.update({ 'user': self.request.user })
		if serializer.is_valid():
			self.pre_save(serializer.object)
			self.object = serializer.save(**save_kwargs)
			self.post_save(self.object, created=created)
			return Response(serializer.data, status=success_status_code)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def partial_update(self, request, *args, **kwargs):
		kwargs['partial'] = True
		kwargs['user'] = request.user
		return self.update(request, *args, **kwargs)
		