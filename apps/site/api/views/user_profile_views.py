__author__ = 'zmmachar'
from rest_framework import generics
from localground.apps.site.models import UserProfile
from localground.apps.site.api.serializers import UserProfileSerializer
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView
import sys
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import GEOSGeometry
from urllib import unquote
from rest_framework.decorators import api_view



class UserProfileList(QueryableListCreateAPIView):
    serializer_class = UserProfileSerializer
    model = UserProfile

    def get_queryset(self):
        return UserProfile.objects.all()
    def pre_save(self, obj):
        obj.owner = self.request.user


class UserProfileInstance(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    model = UserProfile

    def get_queryset(self):
        if self.request.user.is_authenticated():
            return UserProfile.objects.filter(user=self.request.user)

    def pre_save(self, obj):
        obj.owner = self.request.user

@login_required()
@api_view(['PUT', 'PATCH', 'GET'])
def update_user_location(request):
    """
    Meant to allow a user to update their default location
    """
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        return None
    #Nothing can forgive this awful code oh jesus why did I do this
    default_location = unquote(request.body).split('default_location=')[1].replace('+', ' ')
    point = GEOSGeometry(default_location)
    try:
        UserProfile.update_location(profile, point)
    except UserProfile.DoesNotExist:
        print >> sys.stderr, "Failed to update user location"
    return HttpResponse("<p>Location successfully updated</p>")