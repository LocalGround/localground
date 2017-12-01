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

# from django.db import models # maybe excess?
from django.core.files import File
from django.core.files.base import ContentFile
from django.conf import settings
import Image
import ImageOps

'''
John TODOs:

(DONE)
1. Make sure that all of the thumbnailed images are posted to Amazon:
* media_file_large
* media_file_medium
* media_file_medium_sm
* media_file_small
* media_file_marker_lg
* media_file_marker_sm

(DONE)
2. Update Photos API Endpoint so that it's serving the Amazon verion of
the files, not the filesystem ones

3. Fix tests and add new ones to ensure that S3 functionality is
   working

4. On the delete method, remove all images from S3 before deleting the
   record from the database.

5. Delete all filesystem code, *but KEEP THE OLD fields

6. If time, fix the rotation methods so that they pull from and update
   S3 versions of images
'''



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
    media_file = models.FileField(null=True)
    media_file_orig = models.FileField(null=True)
    media_file_large = models.FileField(null=True)
    media_file_medium = models.FileField(null=True)
    media_file_medium_sm = models.FileField(null=True)
    media_file_small = models.FileField(null=True)
    media_file_marker_lg = models.FileField(null=True)
    media_file_marker_sm = models.FileField(null=True)
    device = models.CharField(max_length=255, blank=True, null=True)
    filter_fields = BaseUploadedMedia.filter_fields + ('device',)
    objects = PhotoManager()

    # TODO: move this to a base class
    def get_storage_location(self, user=None):
        user = user or self.owner
        return '/{0}/{1}/{2}/'.format(
            settings.AWS_S3_MEDIA_BUCKET,
            user.username,
            self.model_name_plural
        )

    def set_aws_storage_locations(self, owner):
        storage_location = self.get_storage_location(user=owner)
        self.media_file.storage.location = storage_location
        self.media_file_orig.storage.location = storage_location
        self.media_file_large.storage.location = storage_location
        self.media_file_medium.storage.location = storage_location
        self.media_file_medium_sm.storage.location = storage_location
        self.media_file_small.storage.location = storage_location
        self.media_file_marker_lg.storage.location = storage_location
        self.media_file_marker_sm.storage.location = storage_location

    def generate_thumbnails(self, owner, media_path, im):
        self.set_aws_storage_locations(owner)
        file_name = im.filename
        base_name, ext = os.path.splitext(file_name)
        sizes = [1000, 500, 250, 128, 50, 20]
        photo_paths = [{
            'name': base_name + ext,
            'path': '{0}/{1}'.format(media_path, file_name)
        }]
        raise Exception(file_name, media_path)
        for s in sizes:
            file_name = '{0}_{1}{2}'.format(base_name, s, ext)
            abs_path = '{0}/{1}'.format(media_path, file_name)
            photo_paths.append({
                'name': file_name,
                'path': '{0}/{1}'.format(media_path, file_name)
            })
            if s in [50, 25]:
                # ensure that perfect squares:
                im.thumbnail((s * 2, s * 2), Image.ANTIALIAS)
                im = im.crop([0, 0, s - 2, s - 2])
                # for some reason, ImageOps.expand throws an error for some files:
                im = ImageOps.expand(im, border=2, fill=(255, 255, 255, 255))
            else:
                im.thumbnail((s, s), Image.ANTIALIAS)
            im.save(abs_path)

        # Save to Amazon S3
        self.media_file_orig.save(
            photo_paths[0]['name'], File(open(photo_paths[0]['path']))
        )
        self.media_file.save(
            photo_paths[0]['name'], File(open(photo_paths[0]['path']))
        )
        self.media_file_large.save(
            photo_paths[1]['name'], File(open(photo_paths[1]['path']))
        )
        self.media_file_medium.save(
            photo_paths[2]['name'], File(open(photo_paths[2]['path']))
        )
        self.media_file_medium_sm.save(
            photo_paths[3]['name'], File(open(photo_paths[3]['path']))
        )
        self.media_file_small.save(
            photo_paths[4]['name'], File(open(photo_paths[4]['path']))
        )
        self.media_file_marker_lg.save(
            photo_paths[5]['name'], File(open(photo_paths[5]['path']))
        )
        self.media_file_marker_sm.save(
            photo_paths[6]['name'], File(open(photo_paths[6]['path']))
        )
        self.content_type = ext.replace('.', '')

    def process_file(self, file, owner, name=None):

        # get the orginal file name to successfully save
        file_name_new = upload_helpers.simplify_file_name(file)

        path_to_new = '/tmp/{0}'.format(file_name_new)
        media_path = upload_helpers.generate_absolute_path(owner, self.model_name_plural)
        with open(media_path + file_name_new, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        file_path = media_path + file_name_new
        im = Image.open(file_path)
        exif = self.read_exif_data(im)
        self.device = exif.get('model', None)
        self.point = exif.get('point', None)

        self.generate_thumbnails(owner, media_path, im)
        # lets find out if any path contains S3 links
        # raise Exception(photo_paths)

        # Save file names to model
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

    # Good basis for removing from S3 when saved in S3
    # May be useful as abstract function from base
    def remove_media_from_s3(self):
        self.media_file.storage.location = self.get_storage_location()
        self.media_file_orig.storage.location = self.get_storage_location()
        self.media_file_orig.delete()
        self.media_file.delete()

    # This will eventually get deleted
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
        local_img = open('/tmp/thumb.jpg', 'wb+')
        for chunk in self.media_file_orig.read():
            local_img.write(chunk)
        local_img.close()
        media_path = local_img.name
        # somehow use the django default storage to open file from amazon
        # I believe it is more than

        # 1) do the rotation:
        im = Image.open(media_path)
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
