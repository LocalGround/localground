from django.contrib.gis.db import models
from datetime import datetime
from django.conf import settings
from localground.apps.site.managers import MapImageManager
from localground.apps.site.models import (
    BaseMedia,
    StatusCode,
    BaseUploadedMedia,
    UploadSource,
    BaseExtents)
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import os
from django.contrib.contenttypes import generic

class MapImage(BaseUploadedMedia):
    uuid = models.CharField(unique=True, max_length=8)
    source_print = models.ForeignKey('Print', blank=True, null=True)
    status = models.ForeignKey('StatusCode', default=StatusCode.READY_FOR_PROCESSING) #default to Web Form
    file_name_thumb = models.CharField(max_length=255, blank=True, null=True)
    file_name_scaled = models.CharField(max_length=255, blank=True, null=True)
    scale_factor = models.FloatField(blank=True, null=True)
    upload_source = models.ForeignKey('UploadSource', default=1) #default to Web Form
    email_sender = models.CharField(max_length=255, blank=True, null=True)
    email_subject = models.CharField(max_length=500, blank=True, null=True)
    email_body = models.TextField(null=True, blank=True)
    qr_rect = models.CharField(max_length=255, blank=True, null=True)
    qr_code = models.CharField(max_length=8, blank=True, null=True)
    map_rect = models.CharField(max_length=255, blank=True, null=True)
    processed_image = models.ForeignKey('ImageOpts', blank=True, null=True)
    directory_name = 'map-images'
    objects = MapImageManager()
    
    class Meta:
        app_label = 'site'
        ordering = ['id']
        verbose_name = 'map-image'
        verbose_name_plural = 'map-images'

    def thumb(self):
        '''
        Used for displaying a previously generated thumbnail image
        '''
        return self._encrypt_media_path(
            '%s%s' %
            (self.virtual_path, self.file_name_thumb))

    def get_abs_directory_path(self):
        return '%s/%s' % (settings.FILE_ROOT, self.virtual_path)
    

    def original_image_filesystem(self):
        return '%s/%s' % (self.get_abs_directory_path(), self.file_name_new)

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
        return form.TableModel.objects.filter(mapimage=self)

    def get_markers(self):
        # todo:  implement this...
        return []

    def get_marker_dictionary(self):
        from localground.apps.site.models import Marker
        return Marker.objects.get_marker_dict_by_mapimage(mapimage_id=self.id)

    def to_dict(self):
        from localground.apps.site.api.serializers import MapImageSerializer
        return MapImageSerializer(self, context={'request': {}}).data

    def delete(self, *args, **kwargs):
        # first remove directory, then delete from db:
        import shutil
        import os
        path = self.get_abs_directory_path()
        #raise Exception(path)
        if os.path.exists(path):
            dest = '%s/deleted/%s' % (settings.USER_MEDIA_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.apps.lib.helpers import generic
                dest = dest + '.dup.' + generic.generateID()
            shutil.move(path, dest)

        super(MapImage, self).delete(*args, **kwargs)

    def process(self):
        from localground.apps.lib.image_processing.processor import Processor
        processor = Processor(self)
        processor.process_mapimage()

    def __unicode__(self):
        return 'MapImage #' + self.uuid

class ImageOpts(BaseExtents, BaseMedia):
    source_mapimage = models.ForeignKey(MapImage)

    class Meta:
        app_label = 'site'

    @property
    def model_name(self):
        return self.source_mapimage.model_name

    @property
    def model_name_plural(self):
        return self.source_mapimage.model_name_plural

    def processed_map_url_path(self):
        host = self.source_mapimage.host
        # host = 'dev.localground.org' #just for debugging purposes
        return self._encrypt_media_path(
            '%s%s' %
            (self.source_mapimage.virtual_path,
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
        # don't want to inadvertently remove the parent mapimage, so adding this
        # workaround.  Todo:  update to Django >= 1.3, to configure "cascade
        # delete" settings
        mapimages = MapImage.objects.filter(processed_image=self)
        for s in mapimages:
            s.processed_image = None
            s.save()
        self.delete()
