from django.contrib.gis.db import models
from django.contrib.auth.models import User
from localground.apps.site.models import Base
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

class BasePermissions(models.Model):
    """
    Abstract base class for media groups (Project and View objects).
    """
    access_authority = models.ForeignKey('ObjectAuthority',
                            db_column='view_authority',
                            verbose_name='Sharing')
    access_key = models.CharField(max_length=16, null=True, blank=True)
    users = generic.GenericRelation('UserAuthorityObject')
    
    class Meta:
        abstract = True
        app_label = 'site'

class ObjectAuthority(models.Model):
    """
    Describes the permissions configuration of any class inheriting from
    BasePermissions (either private, public-with-key, or public)
    """
    PRIVATE = 1
    PUBLIC_WITH_LINK = 2
    PUBLIC = 3
    
    name = models.CharField(max_length=255, blank=True)
    description = models.CharField(max_length=1000, blank=True, null=True)
    def __unicode__(self):
        return self.name
    
    class Meta:
        app_label = 'site'
        
class UserAuthority(models.Model):
    """
    Used in conjunction with ObjectAuthority to assign user-level permissions
    (special cases) which are beyond the group's baseline permissions.  There
    are 3 user-level permissions statuses:  "can view," "can edit," and
    "can manage."
    """
    CAN_VIEW = 1
    CAN_EDIT = 2
    CAN_MANAGE = 3
    
    name = models.CharField(max_length=255, blank=True)
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        app_label = 'site'

class UserAuthorityObject(models.Model):
    """
    Model that assigns a particular User (auth_user) and UserAuthority object to
    a particular Group.
    """
    user = models.ForeignKey('auth.User')
    authority = models.ForeignKey('UserAuthority')
    time_stamp = models.DateTimeField(default=datetime.now)
    granted_by = models.ForeignKey('auth.User', related_name="%(app_label)s_%(class)s_related")

    # Following fields are required for using GenericForeignKey
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object = generic.GenericForeignKey()
    
    def to_dict(self):
        return {
            'username': self.auth_user.username,
            'authority_id': self.authority.id,
            'authority': self.authority.name
        }
        
    def __unicode__(self):
        return self.user.username
    
    class Meta:
        app_label = 'site'
        