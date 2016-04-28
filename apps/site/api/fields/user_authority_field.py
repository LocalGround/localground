
from rest_framework import serializers
from rest_framework.reverse import reverse
from localground.apps.site import models

class UserAuthorityObjectRelatedField(serializers.RelatedField):

    def to_representation(self, value):
        if isinstance(value, models.Project):
            return value.id
        raise Exception('Unexpected type of User Authority Object')

    # TODO: Handle content type
    def to_internal_value(self, data):
        return models.Project.objects.get(id=int(data))

class UserAuthorityObjectHyperlink(serializers.HyperlinkedRelatedField):

    def get_url(self, obj, view_name, request, format):
        url_kwargs = {
            'project_id': obj.object_id,
            'user_id': obj.user.id
        }
        return reverse(view_name, kwargs=url_kwargs, request=request, format=format)

    def get_object(self, view_name, view_args, view_kwargs):
         project_id = view_kwargs['project_id']
         user_id = view_kwargs['user_id']
         #return models.UserAuthorityObject.objects.filter(object_id=project_id, user__id=user_id)
         return self.get_queryset().filter(object_id=project_id, user__id=user_id)


