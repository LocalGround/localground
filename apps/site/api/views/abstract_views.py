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

    def perform_create(self, serializer):
        # Todo: this needs to be reviewed
        AuditCreate.perform_create(self, serializer)

        # save uploaded image to file system
        f = self.request.FILES['file_name_orig']
        if f:
            # ensure filetype is valid:
            import os

            ext = os.path.splitext(f.name)[1]
            ext = ext.lower().replace('.', '')
            if ext not in self.ext_whitelist:
                raise exceptions.UnsupportedMediaType(
                    f,
                    '{0} is not a valid {1} file type. Valid options are: {2}'.format(
                        ext,
                        self.model.model_name,
                        self.ext_whitelist))
            project_id = self.request.DATA.get('project_id')
            project = models.Project.objects.get(id=project_id)
            if not project.can_edit(self.request.user):
                raise exceptions.PermissionDenied(
                    detail='You do not have edit access to the project #{0}'.format(project_id))
            obj.save_upload(f, self.request.user, project, do_save=False)


class MediaInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):

    def get_queryset(self):
        return self.model.objects.select_related('owner').all()

    def perform_update(self, serializer):
        return AuditUpdate.perform_update(self, serializer)
