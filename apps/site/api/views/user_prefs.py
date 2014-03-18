from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.gis.geos import GEOSGeometry
import sys

@login_required()
def update_user_location(request):
    """
    Meant to allow a user to update their default location
    """
    from localground.apps.site.models import UserProfile
    try:
        profile = UserProfile.objects.get(user=request.user)

    except UserProfile.DoesNotExist:
        return None
    #Admittedly hacky way of getting at the point info in the request
    point = GEOSGeometry(request.body.split('&')[1].split('%3B')[1].replace('+', ' '))
    try:
        UserProfile.update_location(profile, point)
    except UserProfile.DoesNotExist:
        print >> sys.stderr, "Failed to update user location"

    return HttpResponse("<p>Location successfully updated</p>")

