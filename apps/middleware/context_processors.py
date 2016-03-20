def persistant_queries(request):
    """
    Intercepts HttpRequests in order to add relevant data to the template
    context (mostly used for accessing global settings variables).  Also, for any of
    the map requests (/print/', '/maps/', '/ebays/', '/viewer/',
    '/map-images/update-record/), this function also adds information about the tilesets
    which are available to the interactive map.
    """
    from localground.apps.site.models import WMSOverlay
    from localground.apps.site.models import Project
    from localground.apps.site.models import Form
    import simplejson as json
    from django.conf import settings
    
    context = {
        'path': request.path,
        'user': request.user,
        'is_authenticated': request.user.is_authenticated(),
        'is_impersonation': request.session.get('active_impersonation') is not None,
        'serverURL': settings.SERVER_URL,
        'JQUERY_PATH': settings.JQUERY_PATH,
        'JQUERY_UI_PATH': settings.JQUERY_UI_PATH,
        'BOOTSTRAP_JS_PATH': settings.BOOTSTRAP_JS_PATH,
        'ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE': settings.ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE
    }
    if request.user.is_authenticated():
        context.update({
            'projects': Project.objects.get_objects(request.user)
        })
    
    '''
    TODO:
    This "show_air_quality" flag is a serious hack.  Needs to devise a generalized
    method for showing particular views to particular people (rather than hard-coding)
    '''
    try:
        context.update({
            'show_air_quality': Form.objects.get(id=84).has_access(request.user)
        })
    except Exception:
        pass
    
    add_overlays = False
    for p in ['/print/', '/maps/', '/ebays/', '/viewer/', '/map-images/update-record/']:
        if request.path.startswith(p):
            add_overlays = True
            break
    if add_overlays:
        if request.path in ['/print/']:
            is_printable=True
        context.update({
            'overlays' : json.dumps(
                WMSOverlay.objects.get_objects(user=request.user).to_dict_list()
                #, is_printable=True)
            )
        })
        if request.GET.get('markerID') is not None:
            try:
                context.update({'markerID' : int(request.GET.get('markerID'))})
            except:
                pass
        
    return context
