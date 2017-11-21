from localground.apps.site.managers import AudioManager
from localground.apps.site.models import PointMixin
from localground.apps.site.models import ExtrasMixin
from localground.apps.site.models import BaseUploadedMedia
from localground.apps.lib.helpers import upload_helpers
import os
from django.db import models
from django.core.files.base import ContentFile
from django.conf import settings

'''
Here is the pattern that has to be broken down for a valid url for AWS S3:

example:
https://s3test-assets.s3.amazonaws.com/media/Screen_Shot_2017-11-17_at_12.14.59_PM.png

breakdown of the http address:
https:// {bucketname} .s3.amazonaws.com / {path to media file} / {media file}

somehow, the uploaded file has to be connected with the media
at the end of the url.

Furthermore, when the file is finished processing,
it will be appropriate to assign the uploaded_file
to the one that is tied to a Document object

i.e. doc.upload.url [use-url from FileField] & doc.upload.file
'''


class Audio(ExtrasMixin, PointMixin, BaseUploadedMedia):
    media_file_orig = models.FileField(null=True)
    media_file = models.FileField(null=True)
    objects = AudioManager()

    def process_file(self, file, owner, name=None):
        from django.core.files import File
        file_name_orig = upload_helpers.simplify_file_name(file)
        base_name, ext = os.path.splitext(file_name_orig)

        if ext != '.mp3':
            # use ffmpeg to convert to mp3:
            file_name_new = base_name + '.mp3'
            path_to_mp3 = '/tmp/{0}'.format(file_name_new)
            path_to_orig = '/tmp/{0}'.format(file_name_orig)

            # save original file to disk:
            destination = open(path_to_orig, 'wb+')
            for chunk in file.chunks():
                destination.write(chunk)
            destination.close()
            command = 'ffmpeg -loglevel panic -i \'%s\' -ab 32k -ar 22050 -y \'%s\'' % \
                (path_to_orig, path_to_mp3)
            result = os.popen(command)
        storage_location = '/{0}/{1}/{2}/'.format(
            settings.AWS_S3_MEDIA_BUCKET,
            owner.username,
            self.model_name_plural
        )
        self.media_file.storage.location = storage_location
        self.media_file_orig.storage.location = storage_location

        self.media_file.save(file_name_new, File(open(path_to_mp3)))
        self.media_file_orig.save(file_name_orig, File(open(path_to_orig)))
        self.file_name_orig = file.name
        self.name = name or file.name
        self.file_name_new = file_name_new
        self.content_type = ext.replace('.', '')
        self.save()

    @classmethod
    def process_file1(cls, file, owner, name=None):

        # add new file to S3:
        #save to disk:
        model_name_plural = cls.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(
            owner, model_name_plural, file
        )
        file_name, ext = os.path.splitext(file_name_new)

        # convert to MP3:
        if ext != '.mp3':
            # use ffmpeg to convert to mp3:
            media_path = upload_helpers.generate_absolute_path(
                owner, model_name_plural
            )
            path_to_be_converted = media_path + '/' + file_name_new
            file_name_new = file_name + '.mp3'
            path_to_mp3 = media_path + '/' + file_name_new
            command = 'ffmpeg -loglevel panic -i \'%s\' -ab 32k -ar 22050 -y \'%s\'' % \
                (path_to_be_converted, path_to_mp3)
            result = os.popen(command)


        return {
            'file_name_orig': file.name,
            'name': name or file.name,
            'file_name_new': file_name_new,
            'content_type': ext.replace('.', ''),
            'virtual_path': upload_helpers.generate_relative_path(
                owner, model_name_plural
            )
        }

    def remove_media_from_file_system(self):
        # remove files from file system:
        path = self.get_absolute_path()
        if len(path.split('/')) > 2:  # protects against empty file path
            file_paths = [
                '%s%s' % (path, self.file_name_orig),
                '%s%s' % (path, self.file_name_new)
            ]
            for f in file_paths:
                if os.path.exists(f):
                    os.remove(f)

    def delete(self, *args, **kwargs):
        self.remove_media_from_file_system()
        super(Audio, self).delete(*args, **kwargs)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'audio'
        verbose_name_plural = 'audio'

    def __unicode__(self):
        return self.file_name_new + ': ' + self.name
