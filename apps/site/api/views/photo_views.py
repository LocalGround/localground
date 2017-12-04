import django_filters
from rest_framework import status
from localground.apps.site.api import serializers
from localground.apps.site.api.views.abstract_views import MediaList, MediaInstance
from localground.apps.site import models
from rest_framework.response import Response
from rest_framework.decorators import api_view
from localground.apps.lib.helpers import get_timestamp_no_milliseconds


class PhotoFilter(django_filters.FilterSet):
    min_date = django_filters.DateTimeFilter(
        name="timestamp",
        lookup_type='gte')
    max_date = django_filters.DateTimeFilter(
        name="timestamp",
        lookup_type='lte')

    class Meta:
        model = models.Photo
        fields = ['name', 'description', 'min_date', 'max_date']


class PhotoList(MediaList):
    serializer_class = serializers.PhotoSerializer
    model = models.Photo
    filter_class = PhotoFilter


class PhotoInstance(MediaInstance):
    serializer_class = serializers.PhotoSerializerUpdate
    model = models.Photo


@api_view(['PUT', 'PATCH', 'GET'])
def rotate_left(request, pk, format='html'):
    context = {'request': request}
    try:
        photo = models.Photo.objects.get(id=pk)
        photo.media_file_orig.storage.location = photo.get_storage_location()
        photo.rotate_left()
        photo.last_updated_by = request.user
        photo.time_stamp = get_timestamp_no_milliseconds()
        photo.save()

        return Response(serializers.PhotoSerializer(photo, context=context).data,
                        status=status.HTTP_200_OK)
    except models.Photo.DoesNotExist:
        return Response(
            {"error": "Photo #%s not found on the server" % pk}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT', 'PATCH'])
def rotate_right(request, pk, format='html'):
    context = {'request': request}
    try:
        photo = models.Photo.objects.get(id=pk)
        photo.media_file_orig.storage.location = photo.get_storage_location()
        photo.rotate_right()
        photo.last_updated_by = request.user
        photo.time_stamp = get_timestamp_no_milliseconds()
        photo.save()
        return Response(serializers.PhotoSerializer(photo, context=context).data,
                        status=status.HTTP_200_OK)
    except models.Photo.DoesNotExist:
        return Response(
            {"error": "Photo #%s not found on the server" % pk}, status=status.HTTP_404_NOT_FOUND)
