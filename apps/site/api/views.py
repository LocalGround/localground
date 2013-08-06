from localground.apps.site.api import serializers
from rest_framework.serializers import ValidationError
from localground.apps.site.api.permissions import IsAllowedGivenProjectPermissionSettings
from localground.apps.site.api.filters import SQLFilterBackend
from localground.apps.site import models
from django.contrib.auth.models import User, Group
from rest_framework import generics, renderers, permissions, viewsets, views, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import django_filters
from rest_framework.response import Response
from rest_framework.reverse import reverse
from django.http import Http404, HttpResponseBadRequest, HttpResponse
from rest_framework import status, exceptions
from localground.apps.site.lib.helpers import get_timestamp_no_milliseconds
from rest_framework.utils.formatting import get_view_name, get_view_description


@api_view(('GET',))
@permission_classes((permissions.IsAuthenticated, IsAllowedGivenProjectPermissionSettings, ))
def api_root(request, format=None, **kwargs):
    return Response({
        'photos': reverse('photo-list', request=request, format=format),
        'audio': reverse('audio-list', request=request, format=format),
        'projects': reverse('project-list', request=request, format=format),
        'users': reverse('user-list', request=request, format=format),
        'groups': reverse('group-list', request=request, format=format),
        'markers': reverse('marker-list', request=request, format=format),
        'prints': reverse('print-list', request=request, format=format),
        'tiles': reverse('wmsoverlay-list', request=request, format=format),
        'layouts': reverse('layout-list', request=request, format=format),
        'overlaytypes': reverse('overlaytype-list', request=request, format=format),
        'overlaysources': reverse('overlaysource-list', request=request, format=format)
    })

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


class PhotoViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action. 
    """
    queryset = models.Photo.objects.select_related('project', 'owner').all()
    serializer_class = serializers.PhotoSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)

        
class AudioViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = models.Audio.objects.select_related('project', 'owner').all()
    serializer_class = serializers.AudioSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
        
class PrintViewSet(viewsets.ModelViewSet, AuditUpdate):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = models.Print.objects.select_related('project', 'owner').all()
    serializer_class = serializers.PrintSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class TileViewSet(viewsets.ModelViewSet, AuditUpdate):
    queryset = models.WMSOverlay.objects.select_related('overlay_type', 'overlay_source').all()
    serializer_class = serializers.WMSOverlaySerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class LayoutViewSet(viewsets.ModelViewSet, AuditUpdate):
    queryset = models.Layout.objects.all()
    serializer_class = serializers.LayoutSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class OverlayTypeViewSet(viewsets.ModelViewSet, AuditUpdate):
    queryset = models.OverlayType.objects.all()
    serializer_class = serializers.OverlayTypeSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class OverlaySourceViewSet(viewsets.ModelViewSet, AuditUpdate):
    queryset = models.OverlaySource.objects.all()
    serializer_class = serializers.OverlaySourceSerializer
    filter_backends = (SQLFilterBackend,)
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)

class MarkerList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.MarkerSerializerCounts
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        return models.Marker.objects.get_objects_with_counts(self.request.user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
          
        
class MarkerInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = models.Marker.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
    serializer_class = serializers.MarkerSerializer
    
    def pre_save(self, obj):
        AuditUpdate.pre_save(self, obj)
        
class ProjectList(generics.ListCreateAPIView, AuditCreate):
    serializer_class = serializers.ProjectSerializer
    filter_backends = (SQLFilterBackend,)

    paginate_by = 100
    
    def get_queryset(self):
        user = self.request.user
        return models.Project.objects.select_related('owner').filter(owner=user)
    
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        obj.access_authority = ObjectAuthority.objects.get(id=1)
    
class ProjectInstance(generics.RetrieveUpdateDestroyAPIView, AuditUpdate):
    queryset = models.Project.objects.select_related('owner').all() #.prefetch_related('photos', 'audio', 'marker_set')
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

class RelatedMediaList(generics.ListCreateAPIView,
                     AuditCreate):
    model = models.EntityGroupAssociation
    serializer_class = serializers.AssociationSerializer
    #http://stackoverflow.com/questions/3210491/association-of-entities-in-a-rest-service

    def get_queryset(self):
        group_model = models.Base.get_model(
                model_name_plural=self.kwargs.get('group_name_plural')
            )
        try:
            marker = group_model.objects.get(id=int(self.kwargs.get('group_id')))
        except group_model.DoesNotExist:
            raise Http404
        
        entity_type = models.Base.get_model(
                        model_name_plural=self.kwargs.get('entity_name_plural')
                    ).get_content_type()
        return self.model.objects.filter(
                                entity_type=entity_type,
                                group_type=group_model.get_content_type(),
                                group_id=self.kwargs.get('group_id'))
        
    
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
            d = { 'non_field_errors': messages }
            
            #For a vanilla error:
            d = { 'non_field_errors': ['This relationship already exists in the system'] }
            return Response(d, status=status.HTTP_400_BAD_REQUEST)
 
    def pre_save(self, obj):
        AuditCreate.pre_save(self, obj)
        group_model = models.Base.get_model(
                        model_name_plural=self.kwargs.get('group_name_plural')
                    )
        group_type = group_model.get_content_type()
        entity_model = models.Base.get_model(
                        model_name_plural=self.kwargs.get('entity_name_plural')
                    )
        entity_type = entity_model.get_content_type()
        if self.kwargs.get('entity_name_plural') in ['markers', 'views']:
            raise exceptions.ParseError(
                'You cannot attach a %s to a %s' % (
                    entity_model.model_name, group_model.model_name
            ))
        setattr(obj, 'group_type', group_type)
        setattr(obj, 'group_id', self.kwargs.get('group_id'))
        setattr(obj, 'entity_type', entity_type)

class RelatedMediaInstance(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.EntityGroupAssociation.objects.all()
    serializer_class = serializers.AssociationSerializerDetail
    
    def get_object(self, queryset=None):
        group_type = models.Base.get_model(
                        model_name_plural=self.kwargs.get('group_name_plural')
                    ).get_content_type()
        entity_type = models.Base.get_model(
                        model_name_plural=self.kwargs.get('entity_name_plural')
                    ).get_content_type()
        
        filter_kwargs = {
            'group_id': int(self.kwargs.get('group_id')),
            'entity_id': int(self.kwargs.get('id')),
            'group_type': group_type,
            'entity_type': entity_type
        }
        return generics.get_object_or_404(self.queryset, **filter_kwargs)
    