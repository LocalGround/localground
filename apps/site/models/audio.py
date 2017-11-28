from localground.apps.site.managers import AudioManager
from localground.apps.site.models import PointMixin
from localground.apps.site.models import ExtrasMixin
from localground.apps.site.models import BaseUploadedMedia
from localground.apps.lib.helpers import upload_helpers
import os
import time
from django.db import models
from django.core.files import File
from django.core.files.base import ContentFile
from django.conf import settings


class Audio(ExtrasMixin, PointMixin, BaseUploadedMedia):
    media_file_orig = models.FileField(null=True)
    media_file = models.FileField(null=True)
    objects = AudioManager()

    # TODO: move this to a base class:
    def get_storage_location(self, user=None):
        user = user or self.owner
        return '/{0}/{1}/{2}/'.format(
            settings.AWS_S3_MEDIA_BUCKET,
            user.username,
            self.model_name_plural
        )

    def process_file(self, file, owner, name=None):
        file_name_orig = upload_helpers.simplify_file_name(file)

        base_name, ext = os.path.splitext(file_name_orig)
        path_to_orig = '/tmp/{0}'.format(file_name_orig)
        if os.path.isfile(path_to_orig):
            timestamp = int(time.time())
            base_name = '{0}_{1}'.format(base_name, timestamp)
            file_name_orig = '{0}{1}'.format(base_name, ext)
            path_to_orig = '/tmp/{0}'.format(file_name_orig)

        # If the file is already an MP3, than original and new file the same:
        file_name_new = file_name_orig
        path_to_mp3 = path_to_orig

        # save original file to disk (only necessary b/c of ffmpeg processing):
        destination = open(path_to_orig, 'wb+')
        for chunk in file.chunks():
            destination.write(chunk)
        destination.close()

        if ext != '.mp3':
            # use ffmpeg to convert to mp3:
            file_name_new = base_name + '.mp3'
            path_to_mp3 = '/tmp/{0}'.format(file_name_new)
            command = 'ffmpeg -loglevel panic -i \'%s\' -ab 32k -ar 22050 -y \'%s\'' % \
                (path_to_orig, path_to_mp3)
            result = os.popen(command)

        # set storage location:
        self.media_file.storage.location = \
            self.get_storage_location(user=owner)
        self.media_file_orig.storage.location = \
            self.get_storage_location(user=owner)

        # Save to Amazon
        from django.core.files import File
        self.media_file_orig.save(file_name_orig, File(open(path_to_orig)))
        self.media_file.save(file_name_new, File(open(path_to_mp3)))

        # Save file names to model:
        self.file_name_orig = file.name
        self.name = name or file.name
        self.file_name_new = file_name_new
        self.content_type = ext.replace('.', '')
        self.save()

    def remove_media_from_s3(self):
        self.media_file.storage.location = self.get_storage_location()
        self.media_file_orig.storage.location = self.get_storage_location()
        self.media_file_orig.delete()
        self.media_file.delete()

    def delete(self, *args, **kwargs):
        self.remove_media_from_s3()
        super(Audio, self).delete(*args, **kwargs)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'audio'
        verbose_name_plural = 'audio'

    def __unicode__(self):
        return '{0}: {1}'.format(self.id, self.name)
