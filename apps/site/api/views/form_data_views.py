from rest_framework import viewsets, generics
from localground.apps.site.api import serializers, filters, permissions
from rest_framework.filters import OrderingFilter
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView, QueryableRetrieveUpdateDestroyView
from localground.apps.site import models
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status

def metadata(ret, view, request):
    from localground.apps.lib.helpers import QueryParser
    form = models.Form.objects.get(id=view.kwargs.get('form_id'))
    query = QueryParser(form.TableModel, request.GET.get('query'))
    ret['filters'] = query.to_dict_list()
    return ret

class FormDataMixin(object):

    def get_serializer_class(self, is_list=False):
        '''
        This serializer class gets build dynamically, according to the
        user-generated table being queried
        '''
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
        except models.Form.DoesNotExist:
            raise Http404
        kwargs = self.kwargs
        d = self.request.GET or self.request.POST
        # if self.request.method == 'GET' and is_list and d.get('format') != 'csv':
        #    return serializers.create_compact_record_serializer(form)
        # else:
        return serializers.create_record_serializer(form)

    def get_queryset(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
        except models.Form.DoesNotExist:
            raise Http404
        if self.request.user.is_authenticated():
            # return form.TableModel.objects.get_objects(self.request.user)
            return form.TableModel.objects.all()
        else:
            return form.TableModel.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )


class FormDataList(QueryableListCreateAPIView, FormDataMixin):
    filter_backends = (filters.SQLFilterBackend, OrderingFilter)
    ordering_fields = '__all__'
    model = models.Form

    def perform_create(self, serializer):
        instance = serializer.save()
        instance.save(force_insert=True, user=self.request.user)

    def get_serializer_class(self):
        return FormDataMixin.get_serializer_class(self, is_list=True)

    def metadata(self, request):
        ret = super(QueryableListCreateAPIView, self).metadata(request)
        return metadata(ret, self, request)

    def get_queryset(self):
        try:
            form = models.Form.objects.get(id=self.kwargs.get('form_id'))
        except models.Form.DoesNotExist:
            raise Http404
        if self.request.user.is_authenticated():
            return form.TableModel.objects.get_objects(self.request.user)
        else:
            return form.TableModel.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )
    

class FormDataInstance(QueryableRetrieveUpdateDestroyView, FormDataMixin):

    def get_serializer_class(self):
        return FormDataMixin.get_serializer_class(self)

    def get_queryset(self):
        return FormDataMixin.get_queryset(self)
    
    def metadata(self, request):
        ret = super(QueryableRetrieveUpdateDestroyView, self).metadata(request)
        return metadata(ret, self, request)
    
    #def put(self, request, *args, **kwargs):
    #    raise Exception(args)
    #    return self.update1(request, *args, **kwargs)

    '''

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        kwargs['user'] = request.user
        return self.update(request, *args, **kwargs)
    '''
