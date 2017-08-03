from django.contrib.gis.db import models
from django.conf import settings
from localground.apps.site.models import ProjectMixin, BaseAudit
import os


class Icon(ProjectMixin, BaseAudit, models.Model):
    FILE_TYPES = (
        ('svg', 'svg'),
        ('jpeg', 'jpeg'),
        ('png', 'png')
    )
    name = models.CharField(max_length=255, null=True, blank=True)
    file_type = models.CharField(max_length=63, null=False, blank=False,
                                choices=FILE_TYPES, verbose_name="file type")
    width = models.FloatField(null=False, blank=False)
    height = models.FloatField(null=False, blank=False)
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    file_name_new = models.CharField(max_length=255)
    x_position = models.FloatField(null=False, blank=False)
    y_position = models.FloatField(null=False, blank=False)

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
        super(Icon, self).delete(*args, **kwargs)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'icon'
        verbose_name_plural = 'icons'

    def to_dict(self):
        d = super(Icon, self).to_dict()
        if self.description is not None and len(self.description) > 5:
            d.update({'description': self.description,})
        d.update({'path_orig': self.encrypt_url(self.file_name_orig),})
        return d

    def __unicode__(self):
        return self.file_name_new + ': ' + self.name
