import os
from django.contrib.gis.db import models
from localground.apps.site.models import ProjectMixin, BaseAudit, MediaMixin
from localground.apps.site.managers import IconManager
from localground.apps.lib.helpers import upload_helpers, generic
from PIL import Image, ImageOps
from localground.apps.site.fields import LGImageField


class Icon(ProjectMixin, MediaMixin, BaseAudit):
    FILE_TYPES = (
        ('svg', 'svg'),
        ('jpg', 'jpg'),
        ('png', 'png'),
        ('gif', 'gif')
    )
    size_max = 250.0
    size_min = 10.0
    name = models.CharField(max_length=255, null=True, blank=True)
    file_type = models.CharField(
        max_length=63, null=False, blank=False, choices=FILE_TYPES,
        verbose_name="file type")
    size = models.IntegerField(null=False, blank=False)
    width = models.FloatField(null=False, blank=False)
    height = models.FloatField(null=False, blank=False)
    anchor_x = models.FloatField(null=False, blank=False)
    anchor_y = models.FloatField(null=False, blank=False)
    # S3 File fields
    media_file_new = LGImageField(null=True)
    media_file_resized = LGImageField(null=True)
    objects = IconManager()

    def __init__(self, *args, **kwargs):
        self.tmp_media_binary = None
        self.tmp_resized_binary = None
        super(Icon, self).__init__(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.remove_icons_from_s3()
        super(Icon, self).delete(*args, **kwargs)

    def remove_icons_from_s3(self):
        self.media_file_new.delete()
        self.media_file_resized.delete()

    def send_icons_to_s3(self):
        self.media_file_new.save(
            self.tmp_media_binary.name, self.tmp_media_binary)
        self.media_file_resized.save(
            self.tmp_resized_binary.name, self.tmp_resized_binary
        )

    def process_file(self, file):
        # rename and temporarily store the binary file:
        file.name = upload_helpers.simplify_filename(file)
        self.tmp_media_binary = file

        file_name, ext = os.path.splitext(file.name)
        file_type = ext.replace('.', '').lower()
        scale_ratio = 1.0
        if file_type == 'jpeg':
            file_type = 'jpg'
        file_name_resized = file_name + '_resized.' + file_type
        im = self.django_file_to_pil(file)

        # get largest and smallest value of image
        icon_max = max(im.size) * 1.0
        icon_min = min(im.size) * 1.0

        # get size user entered.  If user didn't enter anything, use
        # largest icon size or size_max.
        # also check to make sure icon size is >= size_min
        if self.size:
            size = self.size
        elif icon_max > Icon.size_max:
            size = Icon.size_max
        elif icon_max < Icon.size_min:
            size = Icon.size_min
        else:
            size = icon_max

        # calculate scale_ratio
        if icon_max != size and icon_min > self.size_min:
            scale_ratio = size / icon_max
        elif icon_min < self.size_min:
            scale_ratio = self.size_min / icon_min
        else:
            scale_ratio = 1.0
        # check for case where resizing by scale ratio would make icon_max
        # too large. in this case, make icon small side as large as possible
        # while keeping icon big side in range
        if scale_ratio > self.size_max / icon_max:
            scale_ratio = self.size_max / icon_max
            size = size * scale_ratio

        # resize icon if needed
        new_x = im.size[0]
        new_y = im.size[1]
        if scale_ratio != 1.0:
            new_x = int(round((im.size)[0] * scale_ratio))
            new_y = int(round((im.size)[1] * scale_ratio))
            im = im.resize((new_x, new_y), Image.ANTIALIAS)

        self.tmp_resized_binary = self.pil_to_django_file(
            im, file_name_resized
        )
        self.tmp_resized_binary.name = file_name_resized
        # set anchor point center of icon or user entered coordinates
        anchor_x = im.size[0] / 2.0
        anchor_y = im.size[1] / 2.0
        validated_data_x = self.anchor_x
        validated_data_y = self.anchor_y
        if validated_data_x is not None and validated_data_x <= new_x:
            anchor_x = validated_data_x
        if validated_data_y is not None and validated_data_y <= new_y:
            anchor_y = validated_data_y

        self.width = im.size[0]
        self.height = im.size[1]
        self.anchor_x = anchor_x
        self.anchor_y = anchor_y
        self.size = size
        self.file_type = file_type

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
