from localground.apps.site.api import serializers
from localground.apps.site.api.permissions import IsOwnerOrReadOnly
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site.models import Photo, Audio, Project
from django.contrib.auth.models import User, Group
from rest_framework import generics, renderers, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import django_filters
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

@api_view(('GET',))
@permission_classes((IsOwnerOrReadOnly, ))
def api_root(request, format=None):
    return Response({
        'photos': reverse('photo-list', request=request, format=format),
        'audio': reverse('audio-list', request=request, format=format),
        'projects': reverse('project-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
        'groups': reverse('group-list', request=request, format=format)
    })


class PhotoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action. 
    """
    queryset = Photo.objects.all()
    serializer_class = serializers.PhotoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    def pre_save(self, obj):
        obj.owner = self.request.user
        
class AudioViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Audio.objects.all()
    serializer_class = serializers.AudioSerializer
    filter_backends = (SQLFilterBackend,)
        
class ProjectList(generics.ListCreateAPIView):
    serializer_class = serializers.ProjectSerializer
    permission_classes = (IsOwnerOrReadOnly,)
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(owner=user)
    
    def pre_save(self, obj):
        '''
        For insert queries
        '''
        from localground.apps.site.models import ObjectAuthority
        obj.owner = self.request.user
        obj.last_updated_by = self.request.user
        obj.access_authority = ObjectAuthority.objects.get(id=1)
    
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    permission_classes = (IsOwnerOrReadOnly,)
    serializer_class = serializers.ProjectSerializer
    
    def pre_save(self, obj):
        '''
        For update queries
        '''
        obj.last_updated_by = self.request.user
    
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
    
    
'''
class ProjectViewSet(viewsets.ModelViewSet):
    model = Project
    serializer_class = serializers.ProjectSerializer
    filter_class = ProjectFilter
    search_fields = ('name', 'tags')

    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Project.objects.filter(owner=user)
'''
