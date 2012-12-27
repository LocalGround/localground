from django.contrib.gis.db import models
from django.conf import settings
from localground.apps.uploads.managers import PhotoManager
from localground.apps.helpers.models import PointObject
from localground.apps.uploads.models import NamedUpload  
        
class Photo(PointObject, NamedUpload):
    source_scan = models.ForeignKey('uploads.Scan', blank=True, null=True)
    source_marker = models.ForeignKey('overlays.Marker', blank=True, null=True)
    file_name_large = models.CharField(max_length=255)
    file_name_medium = models.CharField(max_length=255)
    file_name_medium_sm = models.CharField(max_length=255)
    file_name_small = models.CharField(max_length=255) 
    file_name_marker_lg = models.CharField(max_length=255) 
    file_name_marker_sm = models.CharField(max_length=255) 
    device = models.CharField(max_length=255, blank=True, null=True) 
    objects = PhotoManager()
    
    def __unicode__(self):
        return self.name + ' (' + self.file_name_orig + ')'
    
    class Meta:
        app_label = "uploads"
        ordering = ['id']
        verbose_name = "photo"
        verbose_name_plural = "photos"
    
    def thumb(self):
        '''
        Convenience function
        '''
        return self.encrypt_url(self.file_name_small)
        
        
    def absolute_virtual_path_medium_sm(self):
        '''
        Convenience Function for the template
        '''
        return self.encrypt_url(self.file_name_medium_sm)   
        
    def encrypt_url(self, file_name):
        return self._encrypt_media_path(self.virtual_path + file_name)    
        
    def delete(self, *args, **kwargs):
        #remove images from file system:
        path = self.get_absolute_path()
        file_paths = [
            '%s%s' % (path, self.file_name_orig),
            '%s%s' % (path, self.file_name_new),
            '%s%s' % (path, self.file_name_large),
            '%s%s' % (path, self.file_name_medium),
            '%s%s' % (path, self.file_name_medium_sm),
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
        sizes = [1000, 500, 250, 128, 50, 20]
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
        self.file_name_medium_sm = photo_paths[3]
        self.file_name_small = photo_paths[4]
        self.file_name_marker_lg = photo_paths[5] 
        self.file_name_marker_sm = photo_paths[6]       
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
            'path_medium': self.encrypt_url(self.file_name_medium),
            'path_medium_sm': self.encrypt_url(self.file_name_medium_sm),
            'path_small': self.encrypt_url(self.file_name_small),
            'path_marker_lg': self.encrypt_url(self.file_name_marker_lg),
            'path_marker_sm': self.encrypt_url(self.file_name_marker_sm),
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