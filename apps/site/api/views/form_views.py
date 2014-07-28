from rest_framework import viewsets, generics
from localground.apps.site.api import serializers, filters, permissions
from localground.apps.site.api.views.abstract_views import \
    AuditCreate, AuditUpdate, QueryableListCreateAPIView
from localground.apps.site import models
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status

class FormList(QueryableListCreateAPIView, AuditCreate):
    serializer_class = serializers.FormSerializerList
    filter_backends = (filters.SQLFilterBackend,)
    model = models.Form

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Form.objects.get_objects(self.request.user)
        else:
            return models.Form.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    paginate_by = 100

    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)


class FormInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    model = models.form
    serializer_class = serializers.FormSerializerDetail

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return models.Form.objects.get_objects(self.request.user)
        else:
            return models.Form.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)


