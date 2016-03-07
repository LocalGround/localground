from rest_framework import status, generics, serializers, fields
from rest_framework.views import APIView
from rest_framework.response import Response
from localground.apps.site.models import Audio, Photo, Print, Video
from localground.apps.site.api.serializers import MediaGeometrySerializer
from django.db.models import Func, F
from itertools import chain

class TagList(APIView):

  def get(self, request, *args, **kw):
    audiotags = list(Audio.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    phototags = list(Photo.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    printtags = list(Print.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    videotags = list(Video.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    alltags = list(set(phototags + audiotags + printtags + videotags))
    filterstring = self.request.query_params.get('term', None)
    if filterstring:
    	alltags = [tag for tag in alltags if tag.startswith(filterstring)]
    response = Response(alltags, status=status.HTTP_200_OK)
    return response

class SearchListSerializer(serializers.Serializer):
	tags = fields.ListField(child=serializers.CharField(),required=False,allow_null=True,label='tags',style={'base_template': 'tags.html'},help_text='Tag your object here')
	name = serializers.CharField(required=False, allow_null=True, label='name', allow_blank=True)
	caption = serializers.CharField(source='description', required=False, allow_null=True, label='caption',style={'base_template': 'textarea.html'}, allow_blank=True)
	#overlay_type = serializers.SerializerMethodField()
	#owner = serializers.SerializerMethodField()

class TagSearchList(generics.ListAPIView):
    serializer_class = SearchListSerializer

    def get_queryset(self):
    	tag = self.request.query_params.get('tag', None)
    	audio = Audio.objects.get_objects(self.request.user).filter(tags__contains=[tag])
    	photos = Photo.objects.get_objects(self.request.user).filter(tags__contains=[tag])
    	return list(chain(audio,photos))

       	
