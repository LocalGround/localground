from django.contrib.gis.db import models
from django.conf import settings
from localground.apps.site.managers import PhotoManager
from localground.apps.site.models import ExtrasMixin
from localground.apps.site.models import PointMixin
from localground.apps.site.models import BaseUploadedMedia
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.lib.helpers import upload_helpers
import os
from swampdragon.models import SelfPublishModel
from localground.apps.site.api.realtime_serializers import PhotoRTSerializer


class Photo(ExtrasMixin, PointMixin, BaseUploadedMedia):
    file_name_large = models.CharField(max_length=255)
    file_name_medium = models.CharField(max_length=255)
    file_name_medium_sm = models.CharField(max_length=255)
    file_name_small = models.CharField(max_length=255)
    file_name_marker_lg = models.CharField(max_length=255)
    file_name_marker_sm = models.CharField(max_length=255)
    device = models.CharField(max_length=255, blank=True, null=True)
    filter_fields = BaseUploadedMedia.filter_fields + ('device',)
    objects = PhotoManager()

    @classmethod
    def process_file(cls, file, owner):
        from PIL import Image, ImageOps
        #save to disk:
        model_name_plural = cls.model_name_plural
        file_name_new = upload_helpers.save_file_to_disk(owner, model_name_plural, file)
        file_name, ext = os.path.splitext(file_name_new)

        # create thumbnails:
        media_path = upload_helpers.generate_absolute_path(owner, model_name_plural)
        im = Image.open(media_path + '/' + file_name_new)
        exif = cls.read_exif_data(im)
        sizes = [1000, 500, 250, 128, 50, 20]
        photo_paths = [file_name_new]
        for s in sizes:
            if s in [50, 25]:
                # ensure that perfect squares:
                im.thumbnail((s * 2, s * 2), Image.ANTIALIAS)
                im = im.crop([0, 0, s - 2, s - 2])
                # for some reason, ImageOps.expand throws an error for some files:
                im = ImageOps.expand(im, border=2, fill=(255, 255, 255, 255))
            else:
                im.thumbnail((s, s), Image.ANTIALIAS)
            abs_path = '%s/%s_%s%s' % (media_path, file_name, s, ext)
            im.save(abs_path) # this is where we want to save photos into the Amazon Cloud bucket
            photo_paths.append('%s_%s%s' % (file_name, s, ext))

        return {
            'device': exif.get('model', None),
            'point': exif.get('point', None),
            'file_name_orig': file.name,
            'name': file.name,
            'file_name_new': file_name_new,
            'file_name_large': photo_paths[1],
            'file_name_medium': photo_paths[2],
            'file_name_medium_sm': photo_paths[3],
            'file_name_small': photo_paths[4],
            'file_name_marker_lg': photo_paths[5],
            'file_name_marker_sm': photo_paths[6],
            'content_type': ext.replace('.', ''),
            'virtual_path': upload_helpers.generate_relative_path(owner, model_name_plural)
        }

    def __unicode__(self):
        return '%s (%s)' % (self.name, self.file_name_orig)

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'photo'
        verbose_name_plural = 'photos'

    def thumb(self):
        '''
        Convenience function
        '''
        # return self.file_name_small
        return self.encrypt_url(self.file_name_small)

    def absolute_virtual_path_medium_sm(self):
        '''
        Convenience Function for the template
        '''
        if self.file_name_medium_sm is not None:
            return self.encrypt_url(self.file_name_medium_sm)
        else:
            return self.absolute_virtual_path_medium()

    def absolute_virtual_path_medium(self):
        '''
        Convenience Function for the template
        '''
        return self.encrypt_url(self.file_name_medium)

    def absolute_virtual_path_large(self):
        '''
        Convenience Function for the template
        '''
        return self.encrypt_url(self.file_name_large)

    def remove_media_from_file_system(self):
        path = self.get_absolute_path()
        if len(path.split('/')) > 2:  # protects against empty file path
            file_paths = [
                self.file_name_orig,
                self.file_name_new,
                self.file_name_large,
                self.file_name_medium,
                self.file_name_medium_sm,
                self.file_name_small,
                self.file_name_marker_lg,
                self.file_name_marker_sm
            ]
            for f in file_paths:
                p = '%s%s' % (path, f)
                if (os.path.exists(p) and f is not None and
                        len(f) > 0 and p.find(settings.USER_MEDIA_DIR) > 0):
                    os.remove(p)

    def delete(self, *args, **kwargs):
        self.remove_media_from_file_system()
        super(Photo, self).delete(*args, **kwargs)

    def rotate_left(self, user):
        self.__rotate(user, degrees=90)

    def rotate_right(self, user):
        self.__rotate(user, degrees=270)

    def __rotate(self, user, degrees):
        from PIL import Image, ImageOps
        import time
        timestamp = int(time.time())
        media_path = self.get_absolute_path()

        # 1) do the rotation:
        im = Image.open(media_path + self.file_name_new)
        file_name, ext = os.path.splitext(self.file_name_new)
        im = im.rotate(degrees)
        im.save(media_path + self.file_name_new)

        # 2) create thumbnails:
        sizes = [1000, 500, 250, 128, 50, 20]
        photo_paths = []
        for s in sizes:
            if s in [50, 25]:
                # ensure that perfect squares:
                im.thumbnail((s * 2, s * 2), Image.ANTIALIAS)
                im = im.crop([0, 0, s - 2, s - 2])
                im = ImageOps.expand(im, border=2, fill=(255, 255, 255, 255))
            else:
                im.thumbnail((s, s), Image.ANTIALIAS)
            new_file_path = '%s_%s_%s%s' % (file_name, s, timestamp, ext)
            im.save('%s%s' % (media_path, new_file_path))
            photo_paths.append(new_file_path)

        # 3) delete old, pre-rotated files on file systems:
        file_paths = [
            '%s%s' % (media_path, self.file_name_large),
            '%s%s' % (media_path, self.file_name_medium),
            '%s%s' % (media_path, self.file_name_medium_sm),
            '%s%s' % (media_path, self.file_name_small),
            '%s%s' % (media_path, self.file_name_marker_lg),
            '%s%s' % (media_path, self.file_name_marker_sm)
        ]
        for f in file_paths:
            if os.path.exists(f) and f.find(settings.USER_MEDIA_DIR) > 0:
                os.remove(f)

        # 4) save pointers to new files in database:
        self.file_name_large = photo_paths[0]
        self.file_name_medium = photo_paths[1]
        self.file_name_medium_sm = photo_paths[2]
        self.file_name_small = photo_paths[3]
        self.file_name_marker_lg = photo_paths[4]
        self.file_name_marker_sm = photo_paths[5]
        self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        self.save()

    @classmethod
    def read_exif_data(cls, im):
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
        keys = ['DateTimeOriginal', 'DateTimeDigitized', 'DateTime', 'Model',
                'Orientation', 'GPSInfo']
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
