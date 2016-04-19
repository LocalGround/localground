__author__ = 'zmmachar'
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.contrib.auth.models import User
from localground.apps.site.models.permissions import ObjectAuthority
from localground.apps.site.api.serializers.base_serializer import AuditSerializerMixin

#class UserProfileSerializer(serializers.HyperlinkedModelSerializer):   
class UserProfileSerializer(AuditSerializerMixin, serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.UserProfile
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
        read_only_fields = ('date_created', 'time_stamp')#, 'user')
        depth = 1
        
    user = serializers.HyperlinkedRelatedField(
        label='user',
        view_name='user-detail',
        read_only=True
    )
        
    email_announcements = serializers.NullBooleanField(
        required=False,
        label='email_announcements')

    default_location = fields.GeometryField(
        required=False,
        allow_null=True,
        label='default_location')

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
    
    email = serializers.CharField(
        required=False,
        allow_blank=True,
        label='email',
        source='user.email')
    
    username = serializers.CharField(
        read_only=True,
        label='username',
        source='user.username')

    contacts = serializers.RelatedField(
        many=True,
        label='contacts',
        read_only=True)

    default_view_authority = serializers.ChoiceField(
        choices=map(lambda x: (x.name, x.name),ObjectAuthority.objects.all()),
        required=False,
        label='default_view_authority')

    # def restore_object(self, attrs, instance=None):
    #     """
    #     Given a dictionary of deserialized field values, either update
    #     an existing model instance, or create a new model instance.
    #     """
    #     if instance is not None:
    #         instance.id = attrs.get('id', instance.id)
    #         instance.email_announcements = attrs.get(
    #             'email_announcements',
    #             instance.email_announcements)
    #         instance.default_location = attrs.get(
    #             'default_location',
    #             instance.default_location)
    #         instance.time_stamp = attrs.get('time_stamp', instance.time_stamp)
    #         instance.user = attrs.get('user', instance.user)
    #         #instance.contacts = attrs.get('contacts', instance.contacts)
    #         instance.date_created = attrs.get(
    #             'date_created',
    #             instance.date_created)
    #         instance.default_view_authority = attrs.get(
    #             'default_view_authority',
    #             instance.default_view_authority)
    #         return instance
    #     return models.UserProfile(**attrs)
    
    def update(self, instance, validated_data):
        validated_data.update(self.get_presave_create_dictionary())
        user = instance.user
        updated_user = validated_data.get('user')
        user.first_name = updated_user.get('first_name', user.first_name)
        user.last_name = updated_user.get('last_name', user.last_name)
        user.email = updated_user.get('email', user.email)
        user.save()
        instance.save()
        return instance
    
    '''
    def update(self, instance, validated_data):
        instance.id = validated_data.get('id', instance.id)
        instance.email_announcements = validated_data.get(
            'email_announcements',
            instance.email_announcements)
        instance.default_location = validated_data.get(
            'default_location',
            instance.default_location)
        instance.time_stamp = validated_data.get('time_stamp', instance.time_stamp)
        instance.user = validated_data.get('user', instance.user)
        instance.date_created = validated_data.get(
            'date_created',
            instance.date_created)
        instance.default_view_authority = ObjectAuthority.objects.get(name=validated_data.get('default_view_authority', instance.default_view_authority))
        instance.save()
        instance.user.objects.first_name = validated_data.get('first_name')
        instance.user.objects.last_name = validated_data.get('last_name')
        instance.user.objects.save()
        return instance
    '''

