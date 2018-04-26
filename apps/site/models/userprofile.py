from django.db.models import signals
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from localground.apps.site.models.permissions import ObjectAuthority
from localground.apps.site.models.project import Project
from localground.apps.site.models.styledmap import StyledMap
from datetime import datetime
from django.conf import settings
from django.contrib.gis.geos import GEOSGeometry
import uuid


class UserProfile(models.Model):
    # https://docs.djangoproject.com/en/dev/topics/auth/#creating-users
    # This field is required.
    user = models.OneToOneField(User, related_name="profile")
    email_announcements = models.BooleanField(default=True)
    default_location = models.PointField(
        null=True,
        blank=True,
        help_text='Default center point')
    # default to private
    default_view_authority = models.ForeignKey(
        'ObjectAuthority',
        default=1,
        verbose_name='Share Preference',
        help_text='Your default sharing settings for your maps and media')
    contacts = models.ManyToManyField(
        'auth.User',
        related_name='%(app_label)s_%(class)s_related',
        blank=True,
        verbose_name="Users You're Following")
    date_created = models.DateTimeField(default=datetime.now)
    time_stamp = models.DateTimeField(
        default=datetime.now,
        db_column='last_updated')
    objects = models.GeoManager()

    class Meta:
        app_label = 'site'

    @classmethod
    def update_location(self, profile, point):
        profile.default_location = point
        profile.save()
        return True

    @classmethod
    def create(cls, user):
        # create a new profile:
        profile = UserProfile()
        profile.email_announcements = True
        profile.default_view_authority = ObjectAuthority.objects.get(id=1)
        profile.user = user
        profile.save()

        # create a default project:
        default_project = Project()
        default_project.slug = 'default-' + user.username
        default_project.name = 'My First Project'
        default_project.description = 'Default Local Ground project'
        default_project.last_updated_by = user
        default_project.access_authority = ObjectAuthority.objects.get(id=1)
        default_project.owner = user
        default_project.save()

        # create map:
        StyledMap.create(
            center=GEOSGeometry(
                '{"type": "Point", "coordinates": [-122, 38]}'),
            zoom=6,
            last_updated_by=default_project.owner,
            owner=default_project.owner,
            project=default_project,
            slug=uuid.uuid4().hex,
            name='Untitled Map'
        )
        return profile

    def can_view(self, user=None, access_key=None):
        if user.is_authenticated():
            return True

    def can_edit(self, user):
        if user.is_authenticated():
            return True

    def can_manage(self, user):
        if user.is_authenticated():
            return True


def create_profile_on_insert(sender, instance, created, **kwargs):
    # When a new user is created, also create a profile_object and a default
    # project.  Works just like a database trigger.

    if created:
        UserProfile.create(instance)


signals.post_save.connect(create_profile_on_insert, sender=User)
