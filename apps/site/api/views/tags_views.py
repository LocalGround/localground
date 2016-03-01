from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from localground.apps.site.models import Audio, Photo, Print, Video
from django.db.models import Func, F

class TagList(APIView):

  def get(self, request, *args, **kw):
    phototags = list(Audio.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    audiotags = list(Photo.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    printtags = list(Print.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    videotags = list(Video.objects.get_objects(request.user).annotate(arr_els=Func(F('tags'),function='unnest')).values_list('arr_els', flat=True).distinct())
    alltags = list(set(phototags + audiotags + printtags + videotags))
    response = Response(alltags, status=status.HTTP_200_OK)
    return response
