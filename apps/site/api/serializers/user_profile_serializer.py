__author__ = 'zmmachar'
from rest_framework import serializers
from localground.apps.site import models
from localground.apps.site.api.serializers.base_serializer import BaseSerializer
from localground.apps.site.api import fields


class UserProfileSerializer(BaseSerializer):
    email_announcements = serializers.BooleanField(required=False, label='email_announcements')
    default_location = fields.GeometryField(required=False, label='default_location')
    time_stamp = serializers.DateTimeField(required=False, label='time_stamp')
    user = serializers.HyperlinkedRelatedField(required=False, label='user')
    contacts = serializers.RelatedField(required=False, many=True, label='contacts')

    user = models.OneToOneField(User, related_name="profile") # This field is required.
    default_view_authority = models.ForeignKey('ObjectAuthority',
                                default=1, verbose_name='Share Preference',
                                help_text='Your default sharing settings for your maps and media') #default to private
    contacts = models.ManyToManyField('auth.User', related_name='%(app_label)s_%(class)s_related',
                                      null=True, blank=True,
                                      verbose_name="Users You're Following")
    date_created = models.DateTimeField(default=datetime.now)
    time_stamp = models.DateTimeField(default=datetime.now, db_column='last_updated')

