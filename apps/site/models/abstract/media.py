from django.contrib.gis.db import models
from localground.apps.site.models.abstract.audit import BaseAudit
from localground.apps.site.models.abstract.mixins import ProjectMixin
from django.contrib.postgres.fields import ArrayField
from localground.apps.lib.helpers import upload_helpers
import base64
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
import os
import stat
from rest_framework import exceptions

class BaseMedia(BaseAudit):

    '''
    Important:  the "groups" generic relation is needed to ensure cascading
    deletes.  For example, if a photo gets deleted, you also want to ensure
    that its associations w/any markers / views also get deleted.  The reverse
    relationship needs to be defined here in order for this to occur:
    http://stackoverflow.com/questions/6803018/why-wont-my-genericforeignkey-cascade-when-deleting
    '''
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50)
    groups = GenericRelation(
        'GenericAssociation',
        content_type_field='entity_type',
        object_id_field='entity_id',
        related_query_name="%(app_label)s_%(class)s_related"
    )
    filter_fields = ('id', 'project', 'date_created', 'file_name_orig',)

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_form
        return get_inline_form(cls, user)

    class Meta:
        abstract = True
        app_label = 'site'

    def get_absolute_path(self):
        return upload_helpers.get_absolute_path(self.virtual_path)

    def absolute_virtual_path(self):
        return upload_helpers.encrypt_media_path(
            self.host,
            self.model_name_plural,
            self.virtual_path + self.file_name_new
        )

    def absolute_virtual_path_orig(self):
        return upload_helpers.encrypt_media_path(
            self.host,
            self.model_name_plural,
            self.virtual_path + self.file_name_orig
        )

    def generate_relative_path(self):
        return upload_helpers.generate_relative_path(self.owner, self.model_name_plural)

    def generate_absolute_path(self):
        return upload_helpers.generate_absolute_path(self.owner, self.model_name_plural)

    def _encrypt_media_path(self, path, host=None):
        return upload_helpers.encrypt_media_path(self.host, self.model_name_plural, path)

    def encrypt_url(self, file_name):
        # return self.virtual_path + file_name
        return self._encrypt_media_path(self.virtual_path + file_name)

    @classmethod
    def make_directory(cls, path):
        upload_helpers.make_directory(path)

    def can_view(self, user, access_key=None):
        return self.project.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.project.can_edit(user)


class BaseNamedMedia(BaseMedia, ProjectMixin):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    tags = ArrayField(models.TextField(), default=list)

    filter_fields = BaseMedia.filter_fields + ('name', 'description', 'tags')

    class Meta:
        app_label = 'site'
        abstract = True


class BaseUploadedMedia(BaseNamedMedia):
    file_name_new = models.CharField(max_length=255)
    attribution = models.CharField(max_length=500, blank=True,
                                   null=True, verbose_name="Author / Creator",
                                   help_text="Name of the person who actually created the media file (text)")
    filter_fields = BaseNamedMedia.filter_fields + ('attribution', 'point')

    class Meta:
        abstract = True
        app_label = 'site'

    def save_file_to_disk(self, file):
        return save_file_to_disk(self.owner, self.model_name_plural, file)

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import get_inline_media_form
        return get_inline_media_form(cls, user)

    def get_object_type(self):
        return self._meta.verbose_name
