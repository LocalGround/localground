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
        if not request.user.is_authenticated():
            return False
          
        # Users don't necessarily have access to "SAFE" methods.
        # This needs to be modified.
        if request.method in permissions.SAFE_METHODS:            
            return True

        # Write permissions are only allowed to the owner of the snippet
        return obj.owner == request.user