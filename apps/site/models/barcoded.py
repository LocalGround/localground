from django.contrib.gis.db import models
from datetime import datetime
from django.conf import settings
from localground.apps.site.managers import ScanManager
from localground.apps.site.models import (
    BaseMedia,
    StatusCode,
    BaseUploadedMedia,
    UploadSource,
    BaseExtents)
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import os
from django.contrib.contenttypes import generic



class Processor(BaseUploadedMedia):
    uuid = models.CharField(unique=True, max_length=8)
    source_print = models.ForeignKey('Print', blank=True, null=True)
    status = models.ForeignKey('StatusCode', default=3) #default to Web Form
    file_name_thumb = models.CharField(max_length=255, blank=True, null=True)
    file_name_scaled = models.CharField(max_length=255, blank=True, null=True)
    scale_factor = models.FloatField(blank=True, null=True)
    upload_source = models.ForeignKey('UploadSource', default=1) #default to Web Form
    email_sender = models.CharField(max_length=255, blank=True, null=True)
    email_subject = models.CharField(max_length=500, blank=True, null=True)
    email_body = models.TextField(null=True, blank=True)
    qr_rect = models.CharField(max_length=255, blank=True, null=True)
    qr_code = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        app_label = 'site'
        abstract = True

    def thumb(self):
        '''
        Used for displaying a previously generated thumbnail image
        '''
        return self._encrypt_media_path(
            '%s%s' %
            (self.virtual_path, self.file_name_thumb))

    '''
    def generate_relative_path(self):
        return '/%s/media/%s/%s/%s/' % (settings.USER_MEDIA_DIR,
                                        self.owner.username,
                                        self.directory_name,
                                        self.uuid)

    def generate_absolute_path(self):
        return '%s/media/%s/%s/%s' % (settings.USER_MEDIA_ROOT,
                                      self.owner.username,
                                      self.directory_name,
                                      self.uuid)
    '''
    def get_abs_directory_path(self):
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)
    

    def original_image_filesystem(self):
        return self.get_abs_directory_path() + self.file_name_new

    def copy_as(self, InheritedClass):
        # copies data from one child class to another
        o = InheritedClass()
        o.uuid = self.uuid
        o.project = self.project
        o.host = self.host
        o.virtual_path = self.virtual_path
        o.owner = self.owner
        o.attribution = self.attribution
        o.source_print = self.source_print
        o.status = self.status
        o.file_name_thumb = self.file_name_thumb
        o.file_name_scaled = self.file_name_scaled
        o.file_name_orig = self.file_name_orig
        o.file_name_new = self.file_name_new
        o.scale_factor = self.scale_factor
        o.content_type = self.content_type
        o.upload_source = self.upload_source
        o.email_sender = self.email_sender
        o.email_subject = self.email_subject
        o.email_body = self.email_body
        o.qr_rect = self.qr_rect
        o.qr_code = self.qr_code
        o.last_updated_by = self.last_updated_by
        o.time_stamp = self.time_stamp
        return o


class Scan(Processor):
    # for manual override:
    map_rect = models.CharField(max_length=255, blank=True, null=True)
    processed_image = models.ForeignKey('ImageOpts', blank=True, null=True)
    directory_name = 'map-images'
    objects = ScanManager()

    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'map-image'
        verbose_name_plural = 'map-images'

    def get_object_type(self):
        return 'map-image'

    def processed_map_filesystem(self):
        return self.get_abs_directory_path(
        ) + self.processed_image.file_name_orig

    def processed_map_url_path(self):
        '''
        Used for displaying a previously generated image
        '''
        if self.processed_image:
            return self._encrypt_media_path(
                '%s%s' %
                (self.virtual_path, self.processed_image.file_name_orig))
        else:
            return None

    def get_records_by_form(self, form_id):
        from localground.apps.site.models import Form
        form = Form.objects.get(id=form_id)
        return form.TableModel.objects.filter(scan=self)

    def get_markers(self):
        # todo:  implement this...
        return []

    def get_marker_dictionary(self):
        from localground.apps.site.models import Marker
        return Marker.objects.get_marker_dict_by_scan(scan_id=self.id)

    def to_dict(self):
        from localground.apps.site.api.serializers import ScanSerializer
        return ScanSerializer(self, context={'request': {}}).data

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

        super(Scan, self).delete(*args, **kwargs)

    def process(self):
        from localground.apps.lib.image_processing.processor import Processor
        processor = Processor(self)
        processor.process_scan()

    def __unicode__(self):
        return 'Scan #' + self.uuid

class ImageOpts(BaseExtents, BaseMedia):
    source_scan = models.ForeignKey(Scan)

    class Meta:
        app_label = 'site'

    @property
    def model_name(self):
        return self.source_scan.model_name

    @property
    def model_name_plural(self):
        return self.source_scan.model_name_plural

    def processed_map_url_path(self):
        host = self.source_scan.host
        # host = 'dev.localground.org' #just for debugging purposes
        return self._encrypt_media_path(
            '%s%s' %
            (self.source_scan.virtual_path,
             self.file_name),
            host=host)

    def to_dict(self):
        return {
            'map_image_id': self.id,
            'overlay_path': self.processed_map_url_path(),
            'north': self.northeast.y,
            'south': self.southwest.y,
            'east': self.northeast.x,
            'west': self.southwest.x,
            'zoomLevel': self.zoom
        }

    def save(self, user, *args, **kwargs):
        from localground.apps.lib.helpers import generic
        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            if not hasattr(self, 'owner'):
                self.owner = user
            self.date_created = get_timestamp_no_milliseconds()

        self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(ImageOpts, self).save(*args, **kwargs)

    def delete():
        # don't want to inadvertently remove the parent scan, so adding this
        # workaround.  Todo:  update to Django >= 1.3, to configure "cascade
        # delete" settings
        scans = Scan.objects.filter(processed_image=self)
        for s in scans:
            s.processed_image = None
            s.save()
        self.delete()
