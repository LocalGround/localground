from django.contrib.gis.db import models
from datetime import datetime
from tagging_autocomplete.models import TagAutocompleteField
from django.db.models import Q
from django.conf import settings
from localground.uploads.managers import *
from localground.lib.models import BaseObject, PointObject
import os, stat
import base64       

class Base(models.Model):
    class Meta:
        abstract = True
        
    def _encrypt_media_path(self, path, host=None):
        if host is None:
            host = self.host
            #host = 'dev.localground.org' #for debugging
        return 'http://%s/profile/%s/%s/' % (host, self.model_name_plural, base64.b64encode(path))
        
    @property  
    def model_name(self):
        return self._meta.verbose_name

    @property
    def model_name_plural(self):
        return self._meta.verbose_name_plural


'''Abstract classes come first'''
class Upload(Base):
    '''
    Abstract class that is inherited by most of the models in this file
    '''
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50)
    attribution = models.CharField(max_length=500, blank=True,
                                   null=True, verbose_name="Author / Creator")
    
    class Meta:
        abstract = True
    
    def to_dict(self, **kwargs):
        raise NotImplementedError
    
    def get_absolute_path(self):
        return settings.FILE_ROOT + self.virtual_path
        
    '''def absolute_virtual_path(self):
        return 'http://%s%s%s' % \
                (self.host, self.virtual_path, self.file_name_orig)'''
        
    def absolute_virtual_path(self):
        return self._encrypt_media_path('%s%s' % (self.virtual_path, self.file_name_new))
        
    def absolute_virtual_path_orig(self):
        return self._encrypt_media_path('%s%s' % (self.virtual_path, self.file_name_orig))
        
    def save_upload(self, *args, **kwargs):
        raise NotImplementedError
    
    def generate_relative_path(self):
        return '/static/media/%s/%s/' % (self.owner.username,
                                                 self._meta.verbose_name_plural)
        
    def generate_absolute_path(self):
        return '%s/media/%s/%s' % (settings.STATIC_ROOT, self.owner.username,
                                                self._meta.verbose_name_plural)
    
    def make_directory(self, path):
        from pwd import getpwnam
        os.makedirs(path) #create new directory
        #get OS ids:
        uid = getpwnam(settings.USER_ACCOUNT).pw_uid
        gid = getpwnam(settings.GROUP_ACCOUNT).pw_gid
        #os.chown(path, uid, gid);
        #need to "or" permissions flags together:
        permissions = stat.S_IRWXU | stat.S_IRWXG | stat.S_IROTH | stat.S_IXOTH
        os.chmod(path, permissions)
        
    def save_file_to_disk(self, file):
        #create directory if it doesn't exist:
        media_path = self.generate_absolute_path()
        if not os.path.exists(media_path):
            self.make_directory(media_path)
        
        #derive file name:
        file_name, ext = os.path.splitext(file.name.lower())
        file_name = ''.join(char for char in file_name if char.isalnum()).lower()
        if os.path.exists(media_path + '/%s%s' % (file_name, ext)):
            from time import time
            seconds = int(time())
            file_name = '%s_%s' % (file_name, seconds)
        file_name_new = '%s%s' % (file_name, ext)    
        
        #write request file stream to disk:
        destination     = open(media_path + '/' + file_name_new, 'wb+')
        for chunk in file.chunks():
            destination.write(chunk)
        destination.close()
        return file_name_new
        
    
    def __unicode__(self):
        return self.name
        
class NamedUpload(Upload):
    file_name_new = models.CharField(max_length=255)
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tags = TagAutocompleteField(blank=True, null=True)
    created_timestamp = models.DateTimeField(blank=True, null=True,
                                                verbose_name="Date Created")
    
    def get_name(self):
        if self.name is not None and len(self.name) > 0:
            return self.name
        elif self.file_name_orig is not None and len(self.file_name_orig) > 0:
            return self.file_name_orig
        return 'Untitled'
    
    def orig_url_path(self):
        return self._encrypt_media_path(self.generate_relative_path() + self.file_name_new)
        
    def to_dict(self, **kwargs):
        d = {
            'id': self.id,
            'name': self.get_name(),
            'content_type': self.content_type,
            'path': self.absolute_virtual_path(),
            'file_name_orig': self.file_name_orig,
            'tags': self.tags,
            'project_id': self.project.id    
        }
        #add turned_on flag (only exists for views)
        try: d.update(dict(turned_on=self.turned_on))
        except AttributeError: pass
        
        #add marker (if exists)
        try:
            if self.source_marker is not None:
                d.update(dict(markerID=self.source_marker.id))
        except AttributeError:
            pass
        
        #add lat/lng ( not applicable for scans & attachments)
        try:
            if self.point is not None:
                d.update(dict(lat=self.point.y, lng=self.point.x))
        except AttributeError:
            pass
        
        return d
    
    class Meta:
        abstract = True
        
        
class Processor(BaseObject, NamedUpload):
    uuid = models.CharField(unique=True, max_length=8)
    source_print = models.ForeignKey('prints.Print', blank=True, null=True)
    status = models.ForeignKey('uploads.StatusCode')
    file_name_thumb = models.CharField(max_length=255, blank=True, null=True)
    file_name_scaled = models.CharField(max_length=255, blank=True, null=True)
    scale_factor = models.FloatField(blank=True, null=True)
    upload_source = models.ForeignKey('uploads.UploadSource')
    email_sender = models.CharField(max_length=255, blank=True, null=True)
    email_subject = models.CharField(max_length=500, blank=True, null=True)
    email_body = models.TextField(null=True, blank=True)
    qr_rect = models.CharField(max_length=255, blank=True, null=True)
    qr_code = models.CharField(max_length=8, blank=True, null=True)
    
    def original_image_filesystem(self):
        return self.get_abs_directory_path() + self.file_name_new
        
    def copy_as(self, InheritedClass):
        #copies data from one child class to another
        o = InheritedClass()
        o.uuid = self.uuid
        o.project = self.project
        o.host = self.host
        o.owner = self.owner
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
    
    class Meta:
        abstract = True
        
'''Look up tables come second'''

class StatusCode(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=2000, null=True, blank=True)
    def __unicode__(self):
        return str(self.id) + ': ' + self.name

# input from email, form, or manually:
class UploadSource(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return str(self.id) + '. ' + self.name
        
class UploadType(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return str(self.id) + '. ' + self.name
        
class ErrorCode(models.Model):
    name                  = models.CharField(max_length=255)
    description           = models.CharField(max_length=2000, null=True, blank=True)
    def __unicode__(self):
        return str(self.id) + ': ' + self.name
        
'''Now for the user-populated models'''
    
class Scan(Processor):
    #for manual override:
    map_rect = models.CharField(max_length=255, blank=True, null=True)
    processed_image = models.ForeignKey('uploads.ImageOpts', blank=True, null=True)
    deleted = models.BooleanField(default=False)
    objects = ScanManager()
    
    class Meta:
        ordering = ['id']
        verbose_name = 'map-image'
        verbose_name_plural = 'map-images'
        
    def get_object_type(self):
        return 'map-image'
        
    def generate_relative_path(self):
        return '/static/scans/%s/' % (self.uuid)
        
    def generate_absolute_path(self):
        return '%s/scans/%s/' % (settings.STATIC_ROOT, self.uuid)
    
    def get_abs_directory_path(self):
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)
    
    def processed_map_filesystem(self):
        return self.get_abs_directory_path() + self.processed_image.file_name
        
    def processed_map_url_path(self):
        #return 'http://%s/static/scans/%s/%s' % \
        #                        (self.host, self.uuid, self.processed_image.file_name)
        return self._encrypt_media_path('/static/scans/%s/%s' %
                                    (self.uuid, self.processed_image.file_name))
    
    #todo:  deprecate and use orig_url_path(self) in NamedUpload instead    
    def orig_map_url_path(self):
        #return 'http://%s/static/scans/%s/%s' % \
        #                        (self.host, self.uuid, self.processed_image.file_name)
        return self._encrypt_media_path('/static/scans/%s/%s' %
                                    (self.uuid, self.file_name_new))
    
    #def thumb(self):
    #    return 'http://%s/static/scans/%s/%s' % \
    #        (self.host, self.uuid, self.file_name_thumb)
    
    def thumb(self):
        return self._encrypt_media_path('/static/scans/%s/%s' % (self.uuid, self.file_name_thumb))
    
    
    def orig_file_path(self):
        return 'http://%s/static/scans/%s/%s' % \
                    (self.host, self.uuid, self.file_name_orig)
        
        
    def get_records_by_form(self, form_id):
        from localground.prints.models import Form
        form = Form.objects.get(id=form_id)
        return form.TableModel.objects.filter(scan=self)
        
    
    def get_markers(self):
        reviews = list(Review.objects.select_related('source_marker')
                    .filter(source_scan=self)
                    .order_by('source_marker__name',)
        )
        return [r.source_marker for r in reviews]
        
    def get_marker_dictionary(self):
        from localground.overlays.models import Marker
        return Marker.objects.get_marker_dict_by_scan(scan_id=self.id)
        
    
    def save_upload(self, file, user, project):
        from localground.lib import generic
        from PIL import Image
        
        #1) first, set user, project, and uuid (required for generating file path):
        self.owner = user
        self.last_updated_by = user
        self.project = project
        self.uuid = generic.generateID()
        
        #2) save original file to disk:
        file_name_new = self.save_file_to_disk(file)
        file_name, ext = os.path.splitext(file_name_new)
        
        #3) thumbnail scan:
        thumbnail_name = '%s_thumb.png' % file_name 
        media_path = self.generate_absolute_path()
        im = Image.open(media_path + '/' + file_name_new)
        im.thumbnail([500, 500], Image.ANTIALIAS)
        im.save('%s/%s' % (media_path, thumbnail_name))
        
        #4) save object to database:
        self.status = StatusCode.objects.get(id=1)
        self.upload_source = UploadSource.objects.get(id=1)
        self.file_name_orig = file.name
        self.file_name_new = file_name_new
        self.file_name_thumb = thumbnail_name
        self.content_type = ext.replace('.', '') #file extension      
        self.host = settings.SERVER_HOST
        self.virtual_path = self.generate_relative_path()
        self.save()
        
        #5) call asynchronous processor routine through celery:
        '''from localground.tasks import process_map
        process_map.delay(self.uuid)'''
        #from localground.tasks import add
        #add.delay(2, 4)
        
        '''        
from localground.tasks import process_map
process_map.delay('h3mtkf6f')
process_map.delay('dmxkvn2k')
process_map.delay('bz6mptfq')
process_map.delay('crsgbd2q')
process_map.delay('5bp42gq7')
process_map.delay('h3mtkf6f')
process_map.delay('zmqv8rlv')
 
 
        '''
        
        
    def to_dict(self):
        d = super(Scan, self).to_dict()
        d.update({
            'uuid': self.uuid,
            'file_path': self.orig_file_path()
        })   
        if self.processed_image is not None:
            d.update({
                'map_image_id': self.processed_image.id,
                'north': self.processed_image.northeast.y,
                'south': self.processed_image.southwest.y,
                'east': self.processed_image.northeast.x,
                'west': self.processed_image.southwest.x,
                'zoomLevel': self.processed_image.zoom,
                'overlay_path': self.processed_map_url_path() 
            })
        return d
    
    def delete(self, *args, **kwargs):
        #first remove directory, then delete from db:
        import shutil, os
        path = self.get_abs_directory_path()
        if os.path.exists(path):
            dest = '%s/deleted/%s' % (settings.STATIC_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.lib import generic
                dest = dest + '.dup.' + generic.generateID()
            shutil.move(path, dest)
                    
        super(Scan, self).delete(*args, **kwargs) 
    
    def process(self):
        from localground.uploads.image_processing.processor import Processor
        processor = Processor(self)
        processor.process_scan()
    
    def __unicode__(self):
        return 'Scan #' + self.uuid
        
class Attachment(Processor):
    source_scan         = models.ForeignKey(Scan, blank=True, null=True)
    is_short_form       = models.BooleanField(default=False)
    objects             = ScanManager()
    
    class Meta:
        ordering = ['id']
        verbose_name = 'attachment'
        verbose_name_plural = 'attachments'
        
    def get_object_type(self):
        return 'attachment'
    
    def get_abs_directory_path(self):
        return '%s/attachments/%s/' % (settings.STATIC_ROOT, self.uuid)
        
    def generate_relative_path(self):
        return '/static/attachments/%s/' % (self.uuid)
        
    def thumb(self):
        return self._encrypt_media_path('/static/attachments/%s/%s' % (self.uuid, self.file_name_thumb))
            
    def to_dict(self):
        d = super(Attachment, self).to_dict()
        d.update({
            'thumb_path': self.thumb()
        })
        return d
        
    def process(self):
        from localground.uploads.image_processing.processor import Processor
        processor = Processor(self)
        processor.process_attachment()
    
    #def __unicode__(self):
    #    return self.get_virtual_path()
    
class ImageOpts(Base):
    source_scan = models.ForeignKey(Scan)
    extents = models.PolygonField()
    northeast = models.PointField()
    southwest = models.PointField()
    center = models.PointField()
    zoom = models.IntegerField()
    file_name = models.CharField(max_length=255)
    time_stamp = models.DateTimeField(default=datetime.now, blank=True)
    
    class Meta:
        db_table = u'uploads_scanimageopts'
    
    @property  
    def model_name(self):
        return self.source_scan.model_name

    @property
    def model_name_plural(self):
        return self.source_scan.model_name_plural
        
    def processed_map_url_path(self):
        host = self.source_scan.host
        #host = 'dev.localground.org' #just for debugging purposes
        return self._encrypt_media_path(
            '/static/scans/%s/%s' % (self.source_scan.uuid, self.file_name),
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
    
    def delete():
        #don't want to inadvertently remove the parent scan, so adding this
        #workaround.  Todo:  update to Django 1.3, to configure "cascade
        #delete" settings
        scans = Scan.objects.filter(processed_image=self)
        for s in scans:
            s.processed_image = None
            s.save()
        self.delete()
        
class Photo(PointObject, NamedUpload):
    source_scan = models.ForeignKey(Scan, blank=True, null=True)
    source_marker = models.ForeignKey('overlays.Marker', blank=True, null=True)
    file_name_large = models.CharField(max_length=255)
    file_name_medium = models.CharField(max_length=255)
    file_name_small = models.CharField(max_length=255) 
    file_name_marker_lg = models.CharField(max_length=255) 
    file_name_marker_sm = models.CharField(max_length=255) 
    device = models.CharField(max_length=255, blank=True, null=True) 
    objects = PhotoManager()
    
    def __unicode__(self):
        return self.name + ' (' + self.file_name_orig + ')'
    
    class Meta:
        ordering = ['id']
        verbose_name = "photo"
        verbose_name_plural = "photos"
    
    
    def thumb(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_small)
        
    def absolute_virtual_path_medium(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_medium)
        
    def absolute_virtual_path_small(self):
        return self.thumb()
        
    #def orig_url_path(self):
    #    return self._encrypt_media_path(self.virtual_path + self.file_name_new)
        
    def absolute_virtual_path_marker_lg(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_marker_lg)
    
    def absolute_virtual_path_marker_sm(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_marker_sm)
        
    def delete(self, *args, **kwargs):
        #remove images from file system:
        path = self.get_absolute_path()
        file_paths = [
            '%s%s' % (path, self.file_name_orig),
            '%s%s' % (path, self.file_name_new),
            '%s%s' % (path, self.file_name_large),
            '%s%s' % (path, self.file_name_medium),
            '%s%s' % (path, self.file_name_small),
            '%s%s' % (path, self.file_name_marker_lg),
            '%s%s' % (path, self.file_name_marker_sm)
        ]
        for f in file_paths:
            if os.path.exists(f): os.remove(f)
        
        #execute default behavior
        super(Photo, self).delete(*args, **kwargs)
    
        
    def save_upload(self, file, user, project):
        from PIL import Image, ImageOps
        
        #1) first, set user and project (required for generating file path):
        self.owner = user
        self.last_updated_by = user
        self.project = project
        
        #2) save original file to disk:
        file_name_new = self.save_file_to_disk(file)
        file_name, ext = os.path.splitext(file_name_new)
        
        #3) create thumbnails:
        media_path = self.generate_absolute_path()
        im = Image.open(media_path + '/' + file_name_new)
        d = self.read_exif_data(im)
        sizes = [1000,500,128,50,20]
        photo_paths = [file_name_new]
        for s in sizes:
            if s in [50,25]:
                #ensure that perfect squares:
                im.thumbnail((s*2,s*2), Image.ANTIALIAS)
                im = im.crop([0,0,s-2,s-2])
                im = ImageOps.expand(im, border=2, fill=(255,255,255,255))
            else:
                im.thumbnail((s,s), Image.ANTIALIAS)
            abs_path = '%s/%s_%s%s' % (media_path, file_name, s, ext)
            im.save(abs_path)
            photo_paths.append('%s_%s%s' % (file_name, s, ext))
         
        #4) save object to database:  
        self.file_name_orig = file.name
        self.file_name_new = file_name_new
        self.file_name_large = photo_paths[1]
        self.file_name_medium = photo_paths[2]
        self.file_name_small = photo_paths[3]
        self.file_name_marker_lg = photo_paths[4] 
        self.file_name_marker_sm = photo_paths[5]       
        self.content_type = ext.replace('.', '') #file extension      
        self.host = settings.SERVER_HOST
        self.virtual_path = self.generate_relative_path()
        #from EXIF data:
        self.point = d.get('point', None)
        self.datetime_taken = d.get('datetime_taken', None)
        self.device = d.get('model', None)
        self.save()
        
    def read_exif_data(self, im):
        from PIL.ExifTags import TAGS
        from datetime import datetime
        try:
            info = im._getexif()
        except:
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
                lat = [float(x)/float(y) for x, y in d.get('GPSInfo')[2]]
                latref = d.get('GPSInfo')[1]
                lng = [float(x)/float(y) for x, y in d.get('GPSInfo')[4]]
                lngref = d.get('GPSInfo')[3]
                
                lat = lat[0] + lat[1]/60 + lat[2]/3600
                lng = lng[0] + lng[1]/60 + lng[2]/3600
                if latref == 'S':
                    lat = -lat
                if lngref == 'W':
                    lng = -lng
                return_dict['point'] = Point(lng, lat, srid=4326)
            except:
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
        except:
            pass
        return return_dict

    
    def to_dict(self):
        d = super(Photo, self).to_dict() 
        d.update({
            'path_medium': self.absolute_virtual_path_medium(),
            'path_small': self.absolute_virtual_path_small(),
            'path_marker_lg': self.absolute_virtual_path_marker_lg(),
            'path_marker_sm': self.absolute_virtual_path_marker_sm(),
            'caption': self.description
        })
        if self.point is not None:
            d.update({
                'lat': self.point.y,
                'lng': self.point.x
            })
        if self.source_marker is not None:
            d.update({ 'markerID': self.source_marker.id })
        return d
    
class Audio(PointObject, NamedUpload):
    source_scan         = models.ForeignKey(Scan, blank=True, null=True)
    source_marker       = models.ForeignKey('overlays.Marker', blank=True, null=True)
    deleted             = models.BooleanField(default=False)
    objects             = AudioManager()
    
    def delete(self, *args, **kwargs):
        #remove images from file system:
        path = self.get_absolute_path()
        file_paths = [
            '%s%s' % (path, self.file_name_orig),
            '%s%s' % (path, self.file_name_new)
        ]
        for f in file_paths:
            if os.path.exists(f): os.remove(f)
        
        #execute default behavior
        super(Audio, self).delete(*args, **kwargs)
    
    def save_upload(self, file, user, project):
        #1) first, set user and project (required for generating file path):
        self.owner = user
        self.last_updated_by = user
        self.project = project
        
        #2) save original file to disk:
        file_name_new = self.save_file_to_disk(file)
        file_name, ext = os.path.splitext(file_name_new)
        
        #3) convert to MP3:
        if ext != '.mp3':
            #use ffmpeg to convert to mp3:
            media_path = self.generate_absolute_path()
            path_to_be_converted = media_path + '/' + file_name_new
            file_name_new = file_name + '.mp3'
            path_to_mp3 = media_path + '/' + file_name_new
            command = 'ffmpeg -i \'%s\' -ab 32k -ar 22050 -y \'%s\'' % \
                        (path_to_be_converted, path_to_mp3)
            result = os.popen(command)
            responses = []
            for line in result.readlines():
                responses.append(line)
        
        #4) save object to database:  
        self.file_name_orig = file.name
        self.file_name_new = file_name_new
        self.content_type = ext.replace('.', '') #file extension      
        self.host = settings.SERVER_HOST
        self.virtual_path = self.generate_relative_path()
        self.save()
    
    class Meta:
        ordering = ['id']
        verbose_name = 'audio'
        verbose_name_plural = 'audio-files'
    
    def to_dict(self):
        d = super(Audio, self).to_dict() 
        if self.description is not None and len(self.description) > 5:
            d.update({ 'description': self.description })
        return d
    
    def __unicode__(self):
        return self.path + ': ' + self.name
    
class Snippet(Upload, PointObject):
    source_attachment   = models.ForeignKey(Attachment)
    shape_string_json   = models.CharField(max_length=512, blank=True)
    is_blank            = models.BooleanField(default=False)
    objects             = SnippetManager()
    
    @property
    def file_name_new(self):
        return self.file_name_orig
    
    class Meta:
        ordering = ['id']
        verbose_name = 'snippet'
        verbose_name_plural = 'snippets'
    
    def __unicode__(self):
        return 'Snippet #%s' % self.id
    
    def to_dict(self):
        return {
            'id': self.id,
            'file_name_orig': self.file_name_orig,
            'path': self.absolute_virtual_path(),
            'shape': self.shape_string_json
        }
    
class Video(PointObject, NamedUpload):
    source_scan         = models.ForeignKey(Scan, blank=True, null=True)
    source_marker       = models.ForeignKey('overlays.Marker', blank=True, null=True)
    path                = models.CharField(max_length=255)
    deleted             = models.BooleanField(default=False)
    objects             = VideoManager()
    
    def __unicode__(self):
        return self.path + ': ' + self.name
    
    class Meta:
        ordering = ['id']
        verbose_name = 'video'
        verbose_name_plural = 'videos'
    
    #def to_dict(self):
    #    d = super(Video, self).to_dict()
    #    return d