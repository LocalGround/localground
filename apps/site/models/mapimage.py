from django.contrib.gis.db import models
from datetime import datetime
from django.conf import settings
from localground.apps.site.managers import MapImageManager
from localground.apps.site.models import (
    MediaMixin,
    BaseAudit,
    StatusCode,
    BaseUploadedMedia,
    UploadSource,
    ExtentsMixin)
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import os
from django.contrib.contenttypes import generic
from localground.apps.site.fields import LGImageField


class MapImage(BaseUploadedMedia):
    uuid = models.CharField(unique=True, max_length=8)
    source_print = models.ForeignKey('Print', blank=True, null=True)
    status = models.ForeignKey('StatusCode',
                               default=StatusCode.READY_FOR_PROCESSING)
    # looks like file_name_thumb was the primary key
    # whereas file_name_scaled is never used elsewhere
    file_name_thumb = models.CharField(max_length=255, blank=True, null=True)
    file_name_scaled = models.CharField(max_length=255, blank=True, null=True)
    # file name chars will eventually be replaced
    scale_factor = models.FloatField(blank=True, null=True)
    upload_source = models.ForeignKey('UploadSource', default=1)
    email_sender = models.CharField(max_length=255, blank=True, null=True)
    email_subject = models.CharField(max_length=500, blank=True, null=True)
    email_body = models.TextField(null=True, blank=True)
    qr_rect = models.CharField(max_length=255, blank=True, null=True)
    qr_code = models.CharField(max_length=8, blank=True, null=True)
    map_rect = models.CharField(max_length=255, blank=True, null=True)
    processed_image = models.ForeignKey('ImageOpts', blank=True, null=True)
    # S3 File fields
    media_file_thumb = LGImageField(null=True)
    # no need for scaled since there is no known use of it
    media_file_scaled = LGImageField(null=True)
    objects = MapImageManager()

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'map-image'
        verbose_name_plural = 'map-images'

    # Never used elsewhere besides mapimage test
    def thumb(self):
        '''
        Used for displaying a previously generated thumbnail image
        '''
        return self._build_media_path(
            '%s%s' %
            (self.virtual_path, self.file_name_thumb))

    # These filesystem functions will eventually be replaced by Amazon S3
    def get_abs_directory_path(self):
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)

    def original_image_filesystem(self):
        return '%s%s' % (self.get_abs_directory_path(), self.file_name_new)

    def processed_map_filesystem(self):
        return self.get_abs_directory_path(
        ) + self.processed_image.file_name_orig

    def processed_map_url_path(self):
        '''
        Used for displaying a previously generated image
        '''
        if self.processed_image:
            return self._build_media_path(
                '%s%s' %
                (self.virtual_path, self.processed_image.file_name_orig))
        else:
            return None

    # Made a small rough function to only get an idea
    # because the functions that process the save files
    # does not seem consistent when integrating with
    # existing functions or comparing them to the older code
    # that uses the file system method

    # Still needs work on having proper save procedures
    def send_map_images_to_S3(self):
        # maybe make a new directory for map images
        path = '{0}/media/{1}/{2}'.format(
            settings.USER_MEDIA_ROOT,
            self.owner.username,
            self.uuid
        )
        os.mkdir(path)  # create new directory
        file_name = 'MapImage_' + self.uuid + 'jpg'

        self.media_file_thumb.save(filename, 'Test_thumb.jpg')
        self.media_file_scaled.save(filename, 'Test_scaled.jpg')

    def generate_mapimage(im, size, file_name):
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

    # Making sure that the new process file will
    # work consistently with other methods
    # of uploading files to S3

    '''
    Test Candidate to upload the mapinage to S3
    '''
    def process_mapImage_to_S3(self, file, name=None):
        # WIP on creating thumbnail to save onto S3

        self.uuid = generic.generateID()
        path = '{0}/media/{1}/{2}'.format(
            settings.USER_MEDIA_ROOT,
            self.owner.username,
            self.uuid
        )
        os.mkdir(path)  # create new directory

        from PIL import Image

        im = Image.open(file)
        basename, ext = os.path.splitext(file.name)

        saved_filename = '{0}_{1}.jpg'.format(basename, self.uuid)
        generated_image = self.generate_mapimage(
            im, 500, saved_filename)

        self.media_file_thumb.save(saved_filename, generated_image)

        self.file_name_orig = file.name
        self.name = name or file.name

        self.save()

    def remove_map_image_from_S3(self):
        self.media_file_thumb.delete()
        self.media_file_scaled.delete()

    def delete(self, *args, **kwargs):
        # first remove directory, then delete from db:
        import shutil
        import os
        path = self.get_abs_directory_path()
        if os.path.exists(path):
            dest = '%s/deleted/%s' % (settings.USER_MEDIA_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.apps.lib.helpers import generic
                dest = dest + '.dup.' + generic.generateID()
            shutil.move(path, dest)
        # Eventual goal:
        # self.remove_map_image_from_S3()

        super(MapImage, self).delete(*args, **kwargs)

    def process(self):
        from localground.apps.lib.image_processing.processor import Processor
        processor = Processor(self)
        processor.process_mapimage()

    def __unicode__(self):
        return 'MapImage #' + self.uuid


class ImageOpts(ExtentsMixin, MediaMixin, BaseAudit):
    source_mapimage = models.ForeignKey(MapImage)
    opacity = models.FloatField(default=1)
    name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        app_label = 'site'
        verbose_name = 'map-image'
        verbose_name_plural = 'map-images'

    def processed_map_url_path(self):
        host = self.source_mapimage.host
        # host = 'dev.localground.org' #just for debugging purposes
        return self._build_media_path(
            '%s%s' %
            (self.source_mapimage.virtual_path,
             self.file_name_orig),
            host=host)

    def save(self, user=None, *args, **kwargs):
        from localground.apps.lib.helpers import generic
        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            if not hasattr(self, 'owner') and user is not None:
                self.owner = user
            self.date_created = get_timestamp_no_milliseconds()

        if user is not None:
            self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(ImageOpts, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # don't want to inadvertently remove the parent mapimage, so adding
        # workaround.  Todo:  update to Django >= 1.3, to configure "cascade
        # delete" settings
        mapimages = MapImage.objects.filter(processed_image=self)
        for s in mapimages:
            s.processed_image = None
            s.save()
        super(ImageOpts, self).delete(*args, **kwargs)

    def can_view(self, user, access_key=None):
        return self.source_mapimage.can_view(user, access_key)

    def can_edit(self, user):
        return self.source_mapimage.can_edit(user)
