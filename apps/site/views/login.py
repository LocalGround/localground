from django.contrib.auth.views import login
from django.http import HttpResponseRedirect


def login_check(request, template_name):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/')
    else:
        return login(request)
