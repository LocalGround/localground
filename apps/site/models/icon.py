from django.contrib.gis.db import models
from localground.apps.site.models import ProjectMixin, BaseAudit, MediaMixin
from localground.apps.site.managers import IconManager
import os


class Icon(ProjectMixin, MediaMixin, BaseAudit):
    FILE_TYPES = (
        ('svg', 'svg'),
        ('jpg', 'jpg'),
        ('png', 'png'),
        ('gif', 'gif')
    )
    name = models.CharField(max_length=255, null=True, blank=True)
    file_type = models.CharField(
        max_length=63, null=False, blank=False, choices=FILE_TYPES,
        verbose_name="file type")
    size = models.IntegerField(null=False, blank=False)
    width = models.FloatField(null=False, blank=False)
    height = models.FloatField(null=False, blank=False)
    file_name_new = models.CharField(max_length=255)
    file_name_resized = models.CharField(max_length=255)
    anchor_x = models.FloatField(null=False, blank=False)
    anchor_y = models.FloatField(null=False, blank=False)
    objects = IconManager()

    def delete(self, *args, **kwargs):
        # remove images from file system:
        path = self.get_absolute_path()
        if len(path.split('/')) > 2:  # protects against empty file path
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
            d.update({'description': self.description})
        d.update({'path_orig': self.encrypt_url(self.file_name_orig)})
        return d

    def __unicode__(self):
        return self.file_name_new + ': ' + self.name
