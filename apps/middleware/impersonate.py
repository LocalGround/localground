#!/usr/bin/env python
#//stackoverflow.com/questions/2242909/django-user-impersonation-by-admin
class ImpersonateMiddleware(object):
    def process_request(self, request):
        from django.contrib.auth.models import User
        if request.user.is_superuser and "__impersonate" in request.GET:
            request.session['impersonate_id'] = int(request.GET["__impersonate"])
        elif "__unimpersonate" in request.GET:
            if request.session.get('impersonate_id') is not None:
                del request.session['impersonate_id']
                del request.session['is_impersonation']
        if request.user.is_superuser and 'impersonate_id' in request.session:
            request.user = User.objects.get(id=request.session['impersonate_id'])
            request.session['is_impersonation'] = True
            

