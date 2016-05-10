from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.contrib.auth.models import User
from localground.apps.site.models.permissions import ObjectAuthority
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin

# create a new class for list view and not include email
class UserProfileMixin(AuditSerializerMixin, serializers.HyperlinkedModelSerializer):
    class Meta:
        fields = (
            'url',
            'id',
            'first_name',
            'last_name',
            'email',
            'username',
            'email_announcements',
            'default_view_authority',
            'default_location',
            'contacts',
            'date_created',
            'time_stamp',
            'user'
        )
        read_only_fields = ('date_created', 'time_stamp')
    
    user = serializers.HyperlinkedRelatedField(
        label='user',
        view_name='user-detail',
        read_only=True
    )

    email = serializers.CharField(
        required=False,
        allow_blank=True,
        label='email',
        source='user.email'
    )
        
    email_announcements = serializers.BooleanField(
        required=True,
        style={'base_template': 'checkbox.html'}
    )

    default_location = fields.GeometryField(
        required=False,
        allow_null=True,
        style={'base_template': 'json.html', 'rows': 5}
    )

    first_name = serializers.CharField(
        required=False,
        allow_blank=True,
        label='first_name',
        source='user.first_name')

    last_name = serializers.CharField(
        required=False,
        allow_blank=True,
        label='last_name',
        source='user.last_name')
    
    username = serializers.CharField(
        read_only=True,
        label='username',
        source='user.username')

    contacts = serializers.RelatedField(
        many=True,
        label='contacts',
        read_only=True)

    default_view_authority = serializers.PrimaryKeyRelatedField(
        required=False,
        queryset=ObjectAuthority.objects.all()
    )
        
class UserProfileListSerializer(UserProfileMixin):

    class Meta:
        model = models.UserProfile
        fields = UserProfileMixin.Meta.fields
        read_only_fields = UserProfileMixin.Meta.read_only_fields
        depth = 1


class UserProfileSerializer(UserProfileMixin, serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.UserProfile
        fields = UserProfileMixin.Meta.fields
        read_only_fields = UserProfileMixin.Meta.read_only_fields
        depth = 1

    def update(self, instance, validated_data):
        validated_data.update(self.get_presave_create_dictionary())
        # manually update the User object that UserProfile points to
        user = instance.user
        updated_user = validated_data.get('user')
        user.first_name = updated_user.get('first_name', user.first_name)
        user.last_name = updated_user.get('last_name', user.last_name)
        user.email = updated_user.get('email', user.email)
        user.save()
        if validated_data.get('user'):
            del validated_data['user']
        # manually update view_authority to point to ObjectAuthority object not the string
        instance.default_view_authority = ObjectAuthority.objects.get(name=validated_data.get('default_view_authority', instance.default_view_authority))
        if validated_data.get('default_view_authority'):
            del validated_data['default_view_authority']
        # update all other fields
        for attr, value in validated_data.items():
           setattr(instance, attr, value)
        instance.save()
        return instance
    

