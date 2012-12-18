from django.contrib.gis.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic

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
        app_label = "account"
        
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
        app_label = "account"

class UserAuthorityObject(models.Model):
    """
    Model that assigns a particular User (auth_user) and UserAuthority object to
    a particular Group.
    """
    user = models.ForeignKey('auth.User')
    authority = models.ForeignKey('account.UserAuthority')
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
        app_label = "account"
        db_table = "account_userauthorityobject"
        
class EntityGroupAssociation(models.Model):
    """
    http://weispeaks.wordpress.com/2009/11/04/overcoming-limitations-in-django-using-generic-foreign-keys/
    Uses the contenttypes framework to create one big "meta-association table"
    between media elements (photos, audio files, scans, etc.) and groups.  See
    the reference above for more information about the contenttypes framework.
    """
    user = models.ForeignKey('auth.User')
    time_stamp = models.DateTimeField(default=datetime.now)
    ordering = models.IntegerField()
    turned_on = models.BooleanField()
    
    #generic "Group" foreign key:
    group_type = models.ForeignKey(ContentType)
    group_id = models.PositiveIntegerField()
    group_object = generic.GenericForeignKey('group_type', 'group_id')
    
    #generic "Entity" foreign key, where an entity can be a marker, map image,
    #photo, audio file, media type, or table record.
    entity_type = models.ForeignKey(ContentType, related_name="%(app_label)s_%(class)s_related")
    entity_id = models.PositiveIntegerField()
    entity_object = generic.GenericForeignKey('entity_type', 'entity_id')
    
    def to_dict(self):
        return {
            'username': self.id,
            'ordering': self.ordering,
            'turned_on': self.turned_on
        }
    
    class Meta:
        app_label = "account"
