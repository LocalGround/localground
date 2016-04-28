
from localground.apps.site.api.fields.user_authority_field import UserAuthorityObjectRelatedField, UserAuthorityObjectHyperlink
from django.contrib.auth.models import User
from rest_framework import serializers
from localground.apps.site import models

class UserAuthorityObjectSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), read_only=False, required=True)
    authority = serializers.PrimaryKeyRelatedField(queryset=models.UserAuthority.objects.all(),read_only=False, required=True)
    granted_by = serializers.PrimaryKeyRelatedField(read_only=True)
    object = UserAuthorityObjectRelatedField(read_only=True)
    #url = UserAuthorityObjectHyperlink(view_name='user-authority-instance', queryset=models.UserAuthorityObject.objects.all())
 
    class Meta:
        model = models.UserAuthorityObject
        fields = (
            'id',
            'user',
            'authority',
            'granted_by',
            'object')

    def get_user(self, obj):
        return obj.user.username

    def get_authority(self, obj):
        return obj.name

