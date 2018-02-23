from rest_framework import permissions
from localground.apps.site import models


class CheckUserCanPostToProject(permissions.BasePermission):

    def has_permission(self, request, view):
        # print request.GET
        # print request.POST
        if request.method == 'POST':
            r = request.GET.copy()
            r.update(request.POST)
            # Make sure user has permission to create new record
            # associated with the project
            project_id = r.get('project_id')
            try:
                project = models.Project.objects.get(id=project_id)
                return project.can_edit(request.user)
            except Exception:
                return False
        else:
            return True


class CheckProjectPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.can_view(request.user)
        else:
            return obj.can_edit(request.user)


class CheckProjectSharingPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.can_view(request.user)
