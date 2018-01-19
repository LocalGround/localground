from django.contrib.gis.db import models
from localground.apps.site.models import ProjectMixin, BaseAudit, MediaMixin
from localground.apps.site.managers import IconManager
import os


from localground.apps.site.fields import LGImageField


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
    # S3 File fields
    media_file_new = LGImageField(null=True)
    media_file_resized = LGImageField(null=True)

    def remove_icons_from_s3(self):
        # eventual goal

        self.media_file_new.delete()
        self.media_file_resized.delete()


    def delete(self, *args, **kwargs):
        # eventual goal
        # self.remove_icons_from_s3()

        # execute default behavior
        super(Icon, self).delete(*args, **kwargs)

    # Rough draft output for processing an icon
    # may end up not beign needed
    # However, despite that icon is an image,
    # error claims that there is no definition for image
    def process_file(self, file, name=None):
        im = Image.open(file)

        # read EXIF data:
        exif = self.read_exif_data(im)
        self.device = exif.get('model', None)
        self.point = exif.get('point', None)

        # Save file names to model
        self.file_name_orig = file.name
        self.name = name or file.name

        self.save()

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
