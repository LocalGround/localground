import os
import time
from django.contrib.gis.db import models
from localground.apps.site.managers import PhotoManager
from localground.apps.site.models import ExtrasMixin, PointMixin, \
    BaseUploadedMedia

from django.core.files import File
import Image
import ImageOps
from localground.apps.site.fields import LGImageField


class Photo(ExtrasMixin, PointMixin, BaseUploadedMedia):
    # File System File fields (to be deleted eventually, after the full
    # migration is completed Don't delete yet.)
    file_name_large = models.CharField(max_length=255)
    file_name_medium = models.CharField(max_length=255)
    file_name_medium_sm = models.CharField(max_length=255)
    file_name_small = models.CharField(max_length=255)
    file_name_marker_lg = models.CharField(max_length=255)
    file_name_marker_sm = models.CharField(max_length=255)

    # S3 File fields
    media_file_orig = LGImageField(null=True)
    media_file_large = LGImageField(null=True)
    media_file_medium = LGImageField(null=True)
    media_file_medium_sm = LGImageField(null=True)
    media_file_small = LGImageField(null=True)
    media_file_marker_lg = LGImageField(null=True)
    media_file_marker_sm = LGImageField(null=True)
    device = models.CharField(max_length=255, blank=True, null=True)
    filter_fields = BaseUploadedMedia.filter_fields + ('device',)
    objects = PhotoManager()

    def generate_thumbnail(self, im, size, file_name):
        if size in [50, 25]:
            # ensure that perfect squares:
            im.thumbnail((size * 2, size * 2), Image.ANTIALIAS)
            im = im.crop([0, 0, size - 2, size - 2])
            # for some reason, ImageOps.expand throws an error
            # for some files:
            im = ImageOps.expand(im, border=2, fill=(255, 255, 255, 255))
        else:
            im.thumbnail((size, size), Image.ANTIALIAS)
        return self.pil_to_django_file(im, file_name)

    def generate_thumbnails(self, im, file_name, replace=False):
        base_name, ext = os.path.splitext(file_name)
        if replace:
            self.remove_media_from_s3()

        self.media_file_orig.save(
            file_name,
            self.pil_to_django_file(im, file_name)
        )
        self.media_file_large.save(
            '{0}_1000.jpg'.format(base_name),
            self.generate_thumbnail(im, 1000, '{0}_1000.jpg'.format(base_name))
        )
        self.media_file_medium.save(
            '{0}_500.jpg'.format(base_name),
            self.generate_thumbnail(im, 500, '{0}_500.jpg'.format(base_name))
        )
        self.media_file_medium_sm.save(
            '{0}_250.jpg'.format(base_name),
            self.generate_thumbnail(im, 250, '{0}_250.jpg'.format(base_name))
        )
        self.media_file_small.save(
            '{0}_128.jpg'.format(base_name),
            self.generate_thumbnail(im, 128, '{0}_128.jpg'.format(base_name))
        )
        self.media_file_marker_lg.save(
            '{0}_50.jpg'.format(base_name),
            self.generate_thumbnail(im, 50, '{0}_50.jpg'.format(base_name))
        )
        self.media_file_marker_sm.save(
            '{0}_20.jpg'.format(base_name),
            self.generate_thumbnail(im, 20, '{0}_20.jpg'.format(base_name))
        )
        self.content_type = 'JPG'

    def process_file(self, file, name=None):
        im = Image.open(file)

        # read EXIF data:
        exif = self.read_exif_data(im)
        self.device = exif.get('model', None)
        self.point = exif.get('point', None)

        # generate thumbnails
        self.generate_thumbnails(im, file.name)

        # Save file names to model: Do we still need these fields?
        self.file_name_orig = file.name
        self.name = name or file.name

        self.save()

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.file_name_orig)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'photo'
        verbose_name_plural = 'photos'

    # Good basis for removing from S3 when saved in S3
    # May be useful as abstract function from base
    def remove_media_from_s3(self):
        self.media_file_orig.delete()
        self.media_file_large.delete()
        self.media_file_medium.delete()
        self.media_file_medium_sm.delete()
        self.media_file_small.delete()
        self.media_file_marker_lg.delete()
        self.media_file_marker_sm.delete()

    def delete(self, *args, **kwargs):
        self.remove_media_from_s3()
        super(Photo, self).delete(*args, **kwargs)

    def rotate_left(self):
        self.__rotate(degrees=90)

    def rotate_right(self):
        self.__rotate(degrees=270)

    def __rotate(self, degrees):
        # 1. retrieve file from S3 and convert to PIL image:
        im = self.django_file_field_to_pil(self.media_file_orig)

        # 2. Do the rotation:
        im = im.rotate(degrees)

        # 3. Generate the thumbnails
        base_name, ext = os.path.splitext(self.media_file_orig.name)
        # and salt
        base_name = base_name.split('_t')[0]
        base_name += '_t' + str(time.time()).split('.')[0][5:]
        self.generate_thumbnails(
            im, base_name + ext, replace=True)

        # 3. Save:
        self.save()

    def read_exif_data(self, im):
        from PIL.ExifTags import TAGS
        from datetime import datetime
        try:
            info = im._getexif()
        except Exception:
            return {}
        if info is None:
            return {}
        d = {}
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            d[decoded] = value
        '''
        keys = ['DateTimeOriginal',
                'DateTimeDigitized',
                'DateTime',
                'Model',
                'Orientation',
                'GPSInfo'
               ]
        '''
        return_dict = {}
        if d.get('GPSInfo') is not None:
            from django.contrib.gis.geos import Point
            try:
                lat = [float(x) / float(y) for x, y in d.get('GPSInfo')[2]]
                latref = d.get('GPSInfo')[1]
                lng = [float(x) / float(y) for x, y in d.get('GPSInfo')[4]]
                lngref = d.get('GPSInfo')[3]

                lat = lat[0] + lat[1] / 60 + lat[2] / 3600
                lng = lng[0] + lng[1] / 60 + lng[2] / 3600
                if latref == 'S':
                    lat = -lat
                if lngref == 'W':
                    lng = -lng
                return_dict['point'] = Point(lng, lat, srid=4326)
            except Exception:
                pass
        try:
            if d.get('DateTimeOriginal') is not None:
                return_dict['datetime_taken'] = datetime.strptime(
                    d.get('DateTimeOriginal'), '%Y:%m:%d %H:%M:%S'
                )
            elif d.get('DateTimeDigitized') is not None:
                return_dict['datetime_taken'] = datetime.strptime(
                    d.get('DateTimeDigitized'), '%Y:%m:%d %H:%M:%S'
                )
            elif d.get('DateTime') is not None:
                return_dict['datetime_taken'] = datetime.strptime(
                    d.get('DateTime'), '%Y:%m:%d %H:%M:%S'
                )
            if d.get('Model') is not None:
                return_dict['model'] = d.get('Model')
        except Exception:
            pass
        return return_dict
