
from rest_framework import serializers
from localground.apps.site import models

class UserAuthorityObjectRelatedField(serializers.RelatedField):

    def to_representation(self, value):
        if isinstance(value, models.Project):
            #serializer = ProjectSerializer(value, context={'request': self.request})
            #return serializer.data
            return value.id
        raise Exception('Unexpected type of User Authority Object')

    # TODO: Handle content type
    def to_internal_value(self, data):
        return models.Project.objects.get(id=int(data))