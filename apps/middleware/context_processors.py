def persistant_queries(request):
    """
    Intercepts HttpRequests in order to add relevant data to the template
    context (mostly used for accessing global settings variables).  Also, for any of
    the map requests (/print/', '/maps/', '/ebays/', '/viewer/',
    '/scans/update-record/), this function also adds information about the tilesets
    which are available to the interactive map.
    """
    from localground.apps.overlays.models import WMSOverlay
    import simplejson as json
    from django.conf import settings
    
    context = {
        'path': request.path,
        'user': request.user,
        #'groups': request.user.groups.all(),
        'is_authenticated': request.user.is_authenticated(),
        'is_impersonation': request.session.get('active_impersonation') is not None,
        'serverURL': settings.SERVER_URL,
        'cloudmadeKey': settings.CLOUDMADE_KEY,
        'ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE': settings.ONLY_SUPERUSERS_CAN_REGISTER_PEOPLE
    }
    
    add_overlays = False
    for p in ['/print/', '/maps/', '/ebays/', '/viewer/', '/scans/update-record/']:
        if request.path.startswith(p):
            add_overlays = True
            break
    if add_overlays:
        if request.path in ['/print/']:
            is_printable=True
        context.update({
            'overlays' : json.dumps(
                WMSOverlay.objects.get_my_overlays(user=request.user) #, is_printable=True)
            )
        })
        if request.GET.get('markerID') is not None:
            try:
                context.update({'markerID' : int(request.GET.get('markerID'))})
            except:
                pass
        
    return context
