from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from localground.apps.site.decorators import process_identity, get_group_if_authorized
from localground.apps.site.models import Project  
import simplejson as json

@get_group_if_authorized
def get_group(request, object_type, object_id, group_object, access_key=None, to_json=True):
    '''
    Public view that returns serialized json for a particular Project or View.
    
    Required Parameters (from URL):
    object_type -- either a View or a Project
    object_id -- an id to the corresponding View or Project model
    group_object -- populated by the @get_group_if_authorized decorator
    access
    
    Optional Yes/No parameters (from request.GET params):
        id:                     primary key of object
        include_auth_users:     if true, to_dict queries for list of users who
                                have specific permissions on that print
        include_processed_maps: Also return a list of processed maps (if applicable)
        include_markers:        Also return a list of markers
        include_audio:          Also return a list of audio
        include_photos:         Also return a list of photos
        include_tables:          Also return a list of data list corresponding to
                                tabular form data
        alias:                  Admins only:  allows you to pretend you're someone else        
    '''

    def check_flag(param):
        return request.GET.get(param, 'false') in ['True', 'true', '1', 'on']
        
    dict = group_object.to_dict(
        include_auth_users=check_flag('include_auth_users'),
        include_processed_maps=check_flag('include_processed_maps'),
        include_markers=check_flag('include_markers'),
        include_audio=check_flag('include_audio'),
        include_photos=check_flag('include_photos'),
        include_tables=check_flag('include_tables')
    )
    
    dict.update({
        'success': True,
        'request_parameters': request.GET
    })
    return HttpResponse(json.dumps(dict))

        
@require_http_methods(["GET"])
@process_identity
def get_my_projects(request, identity=None):
    def check_flag(param):
        return request.GET.get(param, 'false') in ['True', 'true', '1', 'on']
    try:   
        projects = (Project.objects
                    .get_objects(user=identity)
                    .to_dict_list(
                        include_auth_users=check_flag('include_auth_users'),
                        include_processed_maps=check_flag('include_processed_maps'),
                        include_markers=check_flag('include_markers'),
                        include_audio=check_flag('include_audio'),
                        include_photos=check_flag('include_photos')
                    ))
        '''from django.shortcuts import render_to_response
        return render_to_response('profile/site.html', {
            'success': True,
            'project': projects,
            'request_parameters': request.GET
        })'''
        return HttpResponse(json.dumps({
            'success': True,
            'project': projects,
            'request_parameters': request.GET
        }))
    except Project.DoesNotExist:
        return HttpResponse(json.dumps({'success': False, 'message': 'No projects found'}))


def get_users_from_username_string(request):
    import re
    from django.contrib.auth.models import User
    
    username_str = request.GET.get('search_text')
    username_str = re.sub(r'\s', '', username_str)  #remove all whitespace
    usernames = re.split(',', username_str)          #split on delimiters
    for (counter, u) in enumerate(usernames):
        usernames[counter] = re.split('\(|\)|:|-', u)[0]
    
    #return HttpResponse(json.dumps({'uname': usernames}))
    try:
        users = (User.objects.filter(username__in=usernames)
                      .order_by('username',))
        d = {
            'success': True,
            'results': [{'id': u.id, 'value': u.username} for u in users]
        }
        return HttpResponse(json.dumps(d))
    except User.DoesNotExist:
        return HttpResponse(json.dumps({'success': False, 'message': 'No users found'}))
    



