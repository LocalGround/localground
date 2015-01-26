#!/usr/bin/env python
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
import json
from localground.apps.site.models import Project, Snapshot
#from localground.apps.lib import sqlparse


def get_group_if_authorized(function):
    '''
    Examines view / project and determines if it's accessible.
    1) query for group
    2) is it public?  if so, return
    3) is it public w/key?  if so, check key:
        key match:  return
        key failure: go to step 4
    4) does logged-in user have access?
        has access:  return
        doesn't have access: redirect to error page
    '''
    def wrapper(
            request,
            object_type,
            slug=None,
            object_id=None,
            access_key=None,
            to_json=False,
            *args,
            **kwargs):
        r = request.GET
        TYPE_LU = {
            'projects': Project,
            'views': Snapshot
        }
        ModelClass = TYPE_LU.get(object_type)
        try:
            if slug is not None:
                source_object = ModelClass.objects.get(slug=slug)
            elif object_id is not None:
                source_object = ModelClass.objects.get(id=object_id)
            else:
                source_object = ModelClass.objects.get(id=r.get('id'))
        except:
            return _render_exception('Not found', to_json=to_json)
        if not source_object.can_view(request.user, access_key):
            return _render_exception('Not authorized', to_json=to_json)
        return function(
            request,
            object_type,
            slug,
            source_object,
            access_key=access_key,
            *args,
            **kwargs)
    return wrapper


def _render_exception(message, to_json=False):
    if not to_json:
        return HttpResponse(message)
    else:
        return HttpResponse(json.dumps({'success': False, 'message': message}))

'''
Note:  Cookies are set in base.js, and read here.
'''


def process_identity(function):
    """
    Needs to be deprecated.  We have a middleware function that does what this
    intended to do.
    """
    def wrapper(request, *args, **kwargs):
        r = request.GET or request.POST
        user = request.user
        # 1) if anonymous request, return error:
        if user.is_anonymous():
            message = 'Identity authentication failure:  user cannot be anonymous'
            if kwargs is not None and kwargs.get('is_json'):
                return HttpResponse(message)
            else:
                return HttpResponse(json.dumps({
                    'code': 'failure',
                    'message': message
                }))

        # 2) if superuser, can override identity w/"alias" request param:
        alias = r.get('alias') or request.COOKIES.get(
            'alias_' +
            request.user.username)
        # return HttpResponse(r)
        if user.is_superuser and alias is not None:
            if alias in ['anonymous', 'all']:
                user = None
            else:
                from django.contrib.auth.models import User
                try:
                    user = User.objects.get(username=alias)
                except User.DoesNotExist:
                    return HttpResponse(json.dumps({
                        'code': 'failure',
                        'message': 'Alias "' + alias + '" does not exist'
                    }))

        # 3) update kwargs dict to return 'identity' entry to calling function:
        if kwargs is None:
            kwargs = {}
        kwargs.update({'identity': user})
        return function(request, *args, **kwargs)
    return wrapper


def process_project(function):
    """
    Selects a default project, based on a combination of explicit and implicit
    parameters (cookies, request parameters, last project created, etc.).  View
    inline comments for details.
    """
    def wrapper(request, *args, **kwargs):
        from localground.apps.site.models import Project
        r = request.GET or request.POST
        cookies = request.COOKIES
        project = None
        user = request.user

        # inner method to get most recent project if default selection isn't
        # valid
        def get_default_project(user):
            projects = Project.objects.filter(
                owner=user).order_by('-time_stamp')
            if len(projects) > 0:
                return projects[0]
            return None

        # 1) if anonymous request, return error:
        if user.is_anonymous():
            return HttpResponse(json.dumps({
                'code': 'failure',
                'message': 'User cannot be anonymous'
            }))

        # 2) order matters (defer to request param before cookie)
        # or cookies.get('project_id_' + user.username)
        project_id = r.get('project_id')
        if project_id is not None:
            if project_id in ['all', 'all#', '']:
                project = None
            elif project_id in ['add', 'add#']:
                project_name = r.get('project_name', None)
                if project_name is None:
                    project = None
                else:
                    # create a new project
                    from localground.apps.site.models import UserProfile
                    import time
                    profile = UserProfile.objects.get(user=request.user)
                    project = Project()
                    project.name = project_name
                    project.owner = user
                    project.slug = '%s-%s' % (project_name, int(time.time()))
                    project.access_authority = profile.default_view_authority
                    project.save()
            else:
                try:
                    project = Project.objects.get(id=int(project_id))
                except ValueError:
                    project = get_default_project(user)
                except Project.DoesNotExist:
                    project = get_default_project(user)

                # is user authorized?
                # if project is not None and project.owner != user and not
                # user.is_superuser:
                if project.can_view(user) == False:
                    return HttpResponse(json.dumps({
                        'code': 'failure',
                        'message': 'Not authorized to view information for %s'
                        % project.name
                    }))
        else:
            # if no project id defined, pick the most recently updated project:
            project = get_default_project(user)

        # 3) update kwargs dict to return 'identity' entry to calling function:
        if kwargs is None:
            kwargs = {}
        kwargs.update({'project': project})
        return function(request, *args, **kwargs)
    return wrapper
