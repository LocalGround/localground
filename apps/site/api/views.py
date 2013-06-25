from rest_framework import generics, renderers, permissions
from rest_framework.response import Response
from localground.apps.site.api.serializers import PhotoSerializer, AudioSerializer, ProjectSerializer
from localground.apps.site.api.permissions import IsOwnerOrReadOnly
from localground.apps.site.models import Photo, Audio, Project
from rest_framework import renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import viewsets
from rest_framework.decorators import link
from rest_framework.views import APIView
from rest_framework.settings import api_settings
from rest_framework.filters import django_filters

#from rest_framework_csv.renderers import CSVRenderer
#from rest_framework.renderers import BrowsableAPIRenderer, JSONRenderer, JSONPRenderer, XMLRenderer

@api_view(('GET',))
def Local_Ground_Root(request, format=None):
    return Response({
        'photos': reverse('photo-list', request=request, format=format),
        'audio': reverse('audio-list', request=request, format=format),
        'projects': reverse('project-list', request=request, format=format)
    })

class PhotoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action. 
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,
                          IsOwnerOrReadOnly,)
    #renderer_classes = ()
    
    @link(renderer_classes=[renderers.StaticHTMLRenderer])
    def highlight(self, request, *args, **kwargs):
        photo = self.get_object()
        return Response(photo.highlighted)

    def pre_save(self, obj):
        obj.owner = self.request.user
        
class AudioViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Audio.objects.all()
    serializer_class = AudioSerializer
 
class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = ['name', 'tags', 'id']
        
class ProjectViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    #queryset = Project.objects.all() #filter(owner=request.user)
    model = Project
    serializer_class = ProjectSerializer
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
from rest_framework.filters import django_filters
class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = ['name', 'tags', 'id']

class ProjectList(generics.ListCreateAPIView):
    # note that either a "model" or a "queryset" property is required here:
    model = Project
    serializer_class = ProjectSerializer
    filter_class = ProjectFilter
    
    def get_queryset(self):
        """
        This view should return a list of all the purchases
        for the currently authenticated user.
        """
        user = self.request.user
        return Project.objects.filter(owner=user)
    
class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Project
    serializer_class = ProjectSerializer
    
'''