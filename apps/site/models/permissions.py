from django.contrib.gis.db import models
from django.contrib.auth.models import User
from localground.apps.site.models import Base
from datetime import datetime
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields
from django.conf import settings


class BasePermissions(models.Model):

    """
    Abstract base class for media groups (Project and View objects).
    """
    access_authority = models.ForeignKey('ObjectAuthority',
                                         db_column='view_authority',
                                         verbose_name='Sharing')
    access_key = models.CharField(max_length=16, null=True, blank=True)
    users = fields.GenericRelation('UserAuthorityObject')

    def _has_user_permissions(self, user, authority_id):
        # anonymous or null users don't have user-level permissions:
        if user is None or not user.is_authenticated():
            return False

        # object owners have blanket view/edit/manage user-level permissions:
        if self.owner == user:
            return True

        # users with privileges which are greater than or equal to
        # the authority_id have user-level permisisons:
        return len(self.users
                   .filter(user=user)
                   .filter(authority__id__gte=authority_id)
                   ) > 0

    def can_view(self, user=None, access_key=None):
        # projects and views marked as public are viewable:
        if self.access_authority.id == ObjectAuthority.PUBLIC:
            return True

        # projects and views marked as "PUBLIC_WITH_LINK" that provide
        # the correct access_key are viewable:
        elif self.access_authority.id == ObjectAuthority.PUBLIC_WITH_LINK \
                and self.access_key == access_key:
            return True

        # projects which are accessible by the user are viewable:
        else:
            return self._has_user_permissions(user, UserAuthority.CAN_VIEW)

    def can_edit(self, user):
        return self._has_user_permissions(user, UserAuthority.CAN_EDIT)

    def can_manage(self, user):
        return self._has_user_permissions(user, UserAuthority.CAN_MANAGE)

    def share_url(self):
        return '/profile/{0}/{1}/share/'.format(
            self.model_name_plural,
            self.id)

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
            'username': self.auth_user.username,
            'authority_id': self.authority.id,
            'authority': self.authority.name
        }

    def __unicode__(self):
        return self.user.username

    # Leveraging parent project / snapshot's can_edit function
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


class AudioUser(ObjectUserPermissions):
    audio = models.ForeignKey(
        'Audio',
        db_column='audio_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_audio'


class PhotoUser(ObjectUserPermissions):
    photo = models.ForeignKey(
        'Photo',
        db_column='photo_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_photos'


class VideoUser(ObjectUserPermissions):
    video = models.ForeignKey(
        'Video',
        db_column='video_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_videos'


class MarkerUser(ObjectUserPermissions):
    marker = models.ForeignKey(
        'Marker',
        db_column='marker_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_markers'


class PrintUser(ObjectUserPermissions):
    print_obj = models.ForeignKey(
        'Print',
        db_column='print_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_prints'

class MapImageUser(ObjectUserPermissions):
    mapimage = models.ForeignKey(
        'MapImage',
        db_column='mapimage_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_mapimages'


class SnapshotUser(ObjectUserPermissions):
    snapshot = models.ForeignKey(
        'Snapshot',
        db_column='snapshot_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_views'


class ProjectUser(ObjectUserPermissions):
    project = models.ForeignKey('Project', db_column='project_id',
                                on_delete=models.DO_NOTHING,
                                related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_projects'


class FormUser(ObjectUserPermissions):
    form = models.ForeignKey('Form', db_column='form_id',
                             on_delete=models.DO_NOTHING,
                             related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_forms'


class PresentationUser(ObjectUserPermissions):
    presentation = models.ForeignKey(
        'Presentation',
        db_column='presentation_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_presentations'
        
class LayerUser(ObjectUserPermissions):
    layer = models.ForeignKey(
        'Layer',
        db_column='layer_id',
        on_delete=models.DO_NOTHING,
        related_name='authuser')

    class Meta:
        app_label = 'site'
        managed = False
        db_table = 'v_private_layers'
