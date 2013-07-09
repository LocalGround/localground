from localground.apps.site.api import serializers
from rest_framework.serializers import ValidationError

from localground.apps.site.api.permissions import IsOwnerOrReadOnly
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site.models import Photo, Audio, Project, Marker, EntityGroupAssociation, ObjectAuthority
from django.contrib.auth.models import User, Group
from rest_framework import generics, renderers, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import django_filters
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from django.http import Http404
from rest_framework import status
from localground.apps.site.lib.helpers import get_timestamp_no_milliseconds
from rest_framework.utils.formatting import get_view_name, get_view_description

class AuditCreate(object):
    
    def pre_save(self, obj):
        '''
        For database inserts
        '''
        obj.owner = self.request.user
        obj.last_updated_by = self.request.user
        obj.timestamp = get_timestamp_no_milliseconds()
        
    def metadata(self, request):
        """
        Return a dictionary of metadata about the view.
        Used to return responses for OPTIONS requests.
        """

        # This is used by ViewSets to disambiguate instance vs list views
        view_name_suffix = getattr(self, 'suffix', None)

        # By default we can't provide any form-like information, however the
        # generic views override this implementation and add additional
        # information for POST and PUT methods, based on the serializer.
        ret = SortedDict()
        ret['name'] = get_view_name(self.__class__, view_name_suffix)
        ret['description'] = get_view_description(self.__class__)
        ret['renders'] = [renderer.media_type for renderer in self.renderer_classes]
        ret['parses'] = [parser.media_type for parser in self.parser_classes]
        return ret
        
class AuditUpdate(AuditCreate):
    def pre_save(self, obj):
        '''
        For database updates
        '''
        obj.last_updated_by = self.request.user
        obj.timestamp = get_timestamp_no_milliseconds()



@api_view(('GET',))
@permission_classes((IsOwnerOrReadOnly, ))
def api_root(request, format=None):
    return Response({
        'photos': reverse('photo-list', request=request, format=format),
        'audio': reverse('audio-list', request=request, format=format),
        'projects': reverse('project-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
        'groups': reverse('group-list', request=request, format=format),
        'markers': reverse('marker-list', request=request, format=format)
    })

class PhotoViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action. 
    """
    queryset = Photo.objects.select_related('project', 'owner').all()
    serializer_class = serializers.PhotoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)

        
class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Audio.objects.select_related('project', 'owner').all()
    serializer_class = serializers.AudioSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
    
class MarkerList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.MarkerSerializerCounts
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        return Marker.objects.get_objects_with_counts(self.request.user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
          
        
class MarkerDetail(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = Marker.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
    permission_classes = (IsOwnerOrReadOnly,)
    serializer_class = serializers.MarkerSerializer
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class ProjectList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        user = self.request.user
        return Project.objects.select_related('owner').filter(owner=user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        obj.access_authority = ObjectAuthority.objects.get(id=1)
    
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = Project.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
    permission_classes = (IsOwnerOrReadOnly,)
    serializer_class = serializers.ProjectDetailSerializer
    
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
    
class AttachItemView(generics.ListCreateAPIView, AuditCreate):
    queryset = EntityGroupAssociation.objects.all()
    serializer_class = serializers.AssociationSerializer

    def create(request, *args, **kwargs):
        '''
        This is a hack:  not sure how to handle generic database errors.
        There's probably a more generic solution.
        '''
        from django.db import connection, IntegrityError, DatabaseError
        try:
            return generics.ListCreateAPIView.create(request, *args, **kwargs)
        except IntegrityError, e:
            connection._rollback()
            # For a verbose error:
            messages = str(e).strip().split('\n')
            d = { 'global': messages }
            
            #For a vanilla error:
            d = { 'global': 'This relationship already exists in the system' }
            return Response(d, status=status.HTTP_400_BAD_REQUEST)
 

    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        
        from localground.apps.site.models import Base
        pk = self.kwargs.get('pk')
        object_name_plural = self.kwargs.get('object_name_plural')
        cls = Base.get_model(model_name_plural=object_name_plural)
        setattr(obj, 'group_type', cls.get_content_type())
        setattr(obj, 'group_id', pk)