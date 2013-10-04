from rest_framework import permissions

class IsAllowedGivenProjectPermissionSettings(permissions.BasePermission):
    """
    Currently a user must always be logged in to access data.  In the neard
    future, a user will also be able to have read-only access data which
    has been flagged as "public" without needing to log in.
    
    For now:
    I.    A user must be logged in.
    II.   A user is only allowed to view:
            1) stuff that s/he owns
            2) stuff to which s/he has been granted access
            3) stuff that's public read only 
    III.  A user is only allowed to modify:
            1) stuff that s/he owns
            2) stuff to which s/he has been granted access
    """

    def has_object_permission(self, request, view, obj):
        '''
        Important:  this is only called for a single object;
                    is not called for a list.
        '''
        #if not request.user.is_authenticated():
        #    return False
          
        # Users don't necessarily have access to "SAFE" methods.
        # This needs to be modified.
        #if request.method in permissions.SAFE_METHODS:            
        #    return True

        # If permissions validation needed (set at the Model Class level),
        # check here:
        if obj.RESTRICT_BY_PROJECT:
            return obj.project.owner==request.user or \
                    request.user in [o.user for o in obj.project.users.select_related('user').all()]
        elif obj.RESTRICT_BY_PROJECTS:
            # TODO: implement security methods for every Local Ground
            # object at the record- and batch-query level.
            return obj.can_view(request.user)
        elif obj.RESTRICT_BY_USER:
            if request.method in permissions.SAFE_METHODS:
                return obj.can_view(request.user, access_key=request.GET.get('access_key'))
            else:    
                return obj.owner == request.user or len(obj.users.filter(user=request.user)) > 0
        return True
    
class IsViewableGivenPermissionSettings(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.can_view(request.user, access_key=request.GET.get('access_key'))
    
    
    
    