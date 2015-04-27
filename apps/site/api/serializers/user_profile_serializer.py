__author__ = 'zmmachar'
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api import fields
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = models.UserProfile
        fields = (
            'url',
            'id',
            'user',
            'email_announcements',
            'default_view_authority',
            'default_location',
            'contacts',
            'date_created',
            'time_stamp')
        depth = 1

    id = serializers.IntegerField(required=True, label='id')
    email_announcements = serializers.NullBooleanField(
        required=False,
        label='email_announcements')
    default_location = fields.GeometryField(
        required=False,
        label='default_location')
    time_stamp = serializers.DateTimeField(required=False, label='time_stamp')
    user = serializers.HyperlinkedRelatedField(
        label='user',
        view_name='user-detail',
        read_only=True)
    contacts = serializers.RelatedField(
        many=True,
        label='contacts',
        read_only=True)
    date_created = serializers.DateTimeField(
        required=False,
        label='date_created')
    default_view_authority = serializers.CharField(
        required=False,
        label='default_view_authority')

    def restore_object(self, attrs, instance=None):
        """
        Given a dictionary of deserialized field values, either update
        an existing model instance, or create a new model instance.
        """
        if instance is not None:
            instance.id = attrs.get('id', instance.id)
            instance.email_announcements = attrs.get(
                'email_announcements',
                instance.email_announcements)
            instance.default_location = attrs.get(
                'default_location',
                instance.default_location)
            instance.time_stamp = attrs.get('time_stamp', instance.time_stamp)
            instance.user = attrs.get('user', instance.user)
            #instance.contacts = attrs.get('contacts', instance.contacts)
            instance.date_created = attrs.get(
                'date_created',
                instance.date_created)
            instance.default_view_authority = attrs.get(
                'default_view_authority',
                instance.default_view_authority)
            return instance
        return models.UserProfile(**attrs)
