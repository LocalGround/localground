from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.api import filters
from localground.apps.site import models
from rest_framework import generics, status, exceptions
from localground.apps.site.api.serializers.user_profile_serializer import UserProfileSerializer


class AuditCreate(object):

    def get_presave_dictionary(self):
        return {
            'owner': self.request.user,
            'last_updated_by': self.request.user,
            'time_stamp': get_timestamp_no_milliseconds()
        }
    
    def perform_create(self, serializer):
        return serializer.save(**self.get_presave_dictionary())


class AuditUpdate(object):
    
    def get_presave_dictionary(self):
        return {
            'last_updated_by': self.request.user,
            'time_stamp': get_timestamp_no_milliseconds()
        }

    def perform_update(self, serializer):
        return serializer.save(**self.get_presave_dictionary())


class QueryableListCreateAPIView(generics.ListCreateAPIView):

    def metadata(self, request):
        # extend the existing metadata method in the parent class by adding a
        # list of available filters
        from localground.apps.lib.helpers import QueryParser
        from django.utils.datastructures import SortedDict

        ret = super(QueryableListCreateAPIView, self).metadata(request)
        ret = SortedDict(ret)
        try:
            query = QueryParser(self.model, request.GET.get('query'))
            ret['filters'] = query.to_dict_list()
        except:
            pass
        return ret
    
class QueryableRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    def metadata(self, request):
        # extend the existing metadata method in the parent class by adding a
        # list of available filters
        from localground.apps.lib.helpers import QueryParser
        from django.utils.datastructures import SortedDict

        ret = super(QueryableListCreateAPIView, self).metadata(request)
        ret = SortedDict(ret)
        try:
            query = QueryParser(self.model, request.GET.get('query'))
            ret['filters'] = query.to_dict_list()
        except:
            pass
        return ret



class MediaList(QueryableListCreateAPIView, AuditCreate):
    filter_backends = (filters.SQLFilterBackend,)
    ext_whitelist = []

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return self.model.objects.get_objects(self.request.user)
        else:
            return self.model.objects.get_objects_public(
                access_key=self.request.GET.get('access_key')
            )

class MediaInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):

    def get_queryset(self):
        return self.model.objects.select_related('owner').all()

    def perform_update(self, serializer):
        return AuditUpdate.perform_update(self, serializer)
