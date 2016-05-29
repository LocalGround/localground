from rest_framework import permissions
from localground.apps.site import models


class CheckProjectPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view(
                request.user,
                access_key=request.GET.get('access_key'))
        else:
            return obj.can_edit(request.user)

class CheckProjectSharingPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.can_view(request.user)

'''
class CheckFormPermissions(permissions.BasePermission):
	
	def has_permission(self, request, view):
		# Controls query-level permissions
		# https://github.com/tomchristie/django-rest-framework/blob/master/rest_framework/permissions.py
		kwargs = getattr(view, 'kwargs', None)
		form = models.Form.objects.get(id=kwargs.get('form_id'))
		return form.can_view(request.user, access_key=request.GET.get('access_key'))
		return False
	
	def has_object_permission(self, request, view, obj):
		if request.method in permissions.SAFE_METHODS:
			return obj.can_view(request.user, access_key=request.GET.get('access_key'))
		else:
			return obj.can_edit(request.user)
'''
