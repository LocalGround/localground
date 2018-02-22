from django.contrib.gis.db import models
from localground.apps.site.managers import VideoManager
from django.contrib.postgres.fields import ArrayField
from localground.apps.site.models import PointMixin, NamedMixin, \
    BaseAudit, ProjectMixin
import os


class Video(ProjectMixin, NamedMixin, PointMixin, BaseAudit):
    VIDEO_PROVIDERS = (
        ('vimeo', 'Vimeo'),
        ('youtube', 'YouTube')
    )
    video_link = models.CharField(null=False, blank=False, max_length=255)
    video_id = models.CharField(null=False, blank=False, max_length=255)
    provider = models.CharField(
        max_length=63, null=False, blank=False, choices=VIDEO_PROVIDERS,
        verbose_name="video provider"
    )

    attribution = models.CharField(
        max_length=500,
        blank=True,
        null=True, verbose_name="Author / Creator",
        help_text="Person / group who created the media file (text)"
    )

    filter_fields = filter_fields = (
        'id', 'project', 'date_created', 'name', 'description', 'tags', 'point'
    )
    objects = VideoManager()

    def can_view(self, user, access_key=None):
        return self.project.can_view(user=user, access_key=access_key) or \
            self.owner == user

    def can_edit(self, user):
        return self.project.can_edit(user) or \
            self.owner == user

    def convertVideoLink(self):
        # Check for provider link:
        idSplit = ""
        if "youtube" in video_link:
            provider = "youtube"
            idSplit = video_link.split("v=")
            video_id = idSplit[1]
        elif "vimeo" in video_link:
            provider = "vimeo"
            idSplit = video_link.split(".com/")
            video_id = idSplit[1]

    def can_delete(self, user):
        return self.can_edit(user)

    def can_manage(self, user):
        return self.project.can_manage(user) or \
            self.owner == user

    def __str__(self):
        return '{0}: {1} ({2}: {3})'.format(
            self.id, self.name, self.video_id, self.provider
        )

    def __repr__(self):
        return '{0}: {1} ({2}: {3})'.format(
            self.id, self.name, self.video_id, self.provider
        )
