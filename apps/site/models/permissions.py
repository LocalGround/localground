from django.contrib.gis.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields
from django.conf import settings
from localground.apps.site.models.abstract.base import Base


class ObjectAuthority(Base):

    """
    Describes the permissions configuration of any class inheriting from
    ObjectPermissionsMixin (either private, public-with-key, or public)
    """
    PRIVATE = 1
    PUBLIC_WITH_LINK = 2  # TODO remove this feature
    PUBLIC = 3

    name = models.CharField(max_length=255, blank=True)
    description = models.CharField(max_length=1000, blank=True, null=True)

    def __unicode__(self):
        return self.name

    class Meta:
        app_label = 'site'


class UserAuthority(Base):

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


class UserAuthorityObject(Base):

    """
    Model that assigns a particular User (auth_user) and UserAuthority
    object to a particular Group.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    authority = models.ForeignKey('UserAuthority')
    time_stamp = models.DateTimeField(default=datetime.now)
    granted_by = models.ForeignKey(
        'auth.User',
        related_name="%(app_label)s_%(class)s_related")

    # Following fields are required for using GenericForeignKey
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    object = fields.GenericForeignKey()

    def to_dict(self):
        return {
            'username': self.user.username,
            'authority_id': self.authority.id,
            'authority': self.authority.name
        }

    def __unicode__(self):
        return self.user.username

    # Leveraging parent project's can_edit function
    def can_view(self, user, access_key=None):
        # to view someone else's privs, you need edit privs:
        return self.object.can_edit(user) or self.user == user

    def can_edit(self, user, authority_id):
        # deletegate to can_manage:
        return self.object.can_manage(user) or \
            (self.user == user and self.authority.id > authority_id)

    def can_delete(self, user):
        return self.object.can_manage(user) or self.user == user

    class Meta:
        app_label = 'site'


class ObjectUserPermissions(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             db_column='user_id', on_delete=models.DO_NOTHING)
    user_authority = models.ForeignKey(
        'UserAuthority',
        db_column='authority_id',
        on_delete=models.DO_NOTHING)

    class Meta:
        abstract = True
        app_label = 'site'


class ProjectUser(ObjectUserPermissions):
    project = models.ForeignKey('Project', db_column='project_id',
                                on_delete=models.DO_NOTHING,
                                related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_projects'
