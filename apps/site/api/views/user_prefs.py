from django.http import HttpResponse
from localground.apps.site.models import UserProfile
from localground.apps.site.api.serializers.user_profile_serializer import UserProfileSerializer

from rest_framework import views
import sys


class UserPreferencesView(views.APIView):

    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
