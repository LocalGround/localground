from localground.apps.site.managers import AudioManager
from localground.apps.site.models import PointMixin
from localground.apps.site.models import ExtrasMixin
from localground.apps.site.models import BaseUploadedMedia
from localground.apps.lib.helpers import upload_helpers
import os


class Audio(ExtrasMixin, PointMixin, BaseUploadedMedia):
    objects = AudioManager()

    @classmethod
    def process_file(cls, file, owner, name=None):
        
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
