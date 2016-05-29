from rest_framework import generics, exceptions
from localground.apps.site.models import UserProfile
from localground.apps.site.api.serializers import UserProfileSerializer, UserProfileListSerializer
from localground.apps.site.api.views.abstract_views import \
    QueryableListCreateAPIView, QueryableListAPIView
import sys
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import GEOSGeometry
from urllib import unquote
from rest_framework.decorators import api_view


class UserProfileList(QueryableListAPIView):
    serializer_class = UserProfileListSerializer
    model = UserProfile

    def get_queryset(self):
        return UserProfile.objects.all()

    def pre_save(self, obj):
        obj.owner = self.request.user


class UserProfileInstance(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    model = UserProfile

    def get_queryset(self):
        user_profile = UserProfile.objects.get(id=self.kwargs[self.lookup_field])
        if user_profile.user == self.request.user or self.request.user.is_superuser:
            return UserProfile.objects.all() #filter(user=self.request.user)
        else:
            raise exceptions.PermissionDenied(detail="You can only view the details of your own user profile")

    def pre_save(self, obj):
        obj.owner = self.request.user