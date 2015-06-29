from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.http import HttpResponse
from localground.apps.site.decorators import get_group_if_authorized
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.template import RequestContext
import simplejson as json
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from localground.apps.site.models import Photo
from django.core.exceptions import ObjectDoesNotExist

def sdtest(request, template='pages/sdtest.html', slug=None):
    u = request.user
    context = RequestContext(request)
    username = u.username
    # set defaults:
    # if u.is_authenticated():
    #     photo = Photo.objects.get(pk=1)
    # context.update({
    #     'photo': json.dumps(photo),
    # })
    return render_to_response(template, context)