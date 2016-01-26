from django.contrib.gis.db import models
from django.conf import settings
from localground.apps.site.managers import AudioManager
from localground.apps.site.models import BasePointMixin, ExtrasMixin, BaseUploadedMedia
import os


class Audio(ExtrasMixin, BasePointMixin, BaseUploadedMedia):
    name = name_plural = 'audio'
    objects = AudioManager()

    def delete(self, *args, **kwargs):
        # remove images from file system:
        path = self.get_absolute_path()
        if len(path.split('/')) > 2: #protects against empty file path
            file_paths = [
                '%s%s' % (path, self.file_name_orig),
                '%s%s' % (path, self.file_name_new)
            ]
            for f in file_paths:
                if os.path.exists(f):
                    os.remove(f)

        # execute default behavior
        super(Audio, self).delete(*args, **kwargs)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'audio'
        verbose_name_plural = 'audio'

    def to_dict(self):
        d = super(Audio, self).to_dict()
        if self.description is not None and len(self.description) > 5:
            d.update({'description': self.description,})
        d.update({'path_orig': self.encrypt_url(self.file_name_orig),})
        return d

    def __unicode__(self):
        return self.file_name_new + ': ' + self.name
