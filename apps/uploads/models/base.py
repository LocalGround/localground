from django.contrib.gis.db import models
from datetime import datetime
from tagging_autocomplete.models import TagAutocompleteField
from django.conf import settings
import os, stat
import base64       

class Base(models.Model):
    class Meta:
        abstract = True
        app_label = "uploads"
        
    def _encrypt_media_path(self, path, host=None):
        if host is None:
            host = self.host
            #host = 'dev.localground.org' #for debugging
        from django.http import HttpResponse
        #return path
        return 'http://%s/profile/%s/%s/' % (host, self.model_name_plural, base64.b64encode(path))
        
    @property  
    def model_name(self):
        return self._meta.verbose_name

    @property
    def model_name_plural(self):
        return self._meta.verbose_name_plural

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
        app_label = "uploads"
    
    def to_dict(self, **kwargs):
        raise NotImplementedError
    
    def get_absolute_path(self):
        return settings.FILE_ROOT + self.virtual_path
        
    def absolute_virtual_path(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_new)
        
    def absolute_virtual_path_orig(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_orig)
        
    def save_upload(self, *args, **kwargs):
        raise NotImplementedError
    
    def generate_relative_path(self):
        return '/%s/media/%s/%s/' % (settings.USER_MEDIA_DIR, self.owner.username,
                                                 self._meta.verbose_name_plural)
        
    def generate_absolute_path(self):
        return '%s/media/%s/%s' % (settings.USER_MEDIA_ROOT, self.owner.username,
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
        app_label = "uploads"

class StatusCode(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=2000, null=True, blank=True)
    def __unicode__(self):
        return str(self.id) + ': ' + self.name
        
    class Meta:
        app_label = "uploads"

class UploadSource(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return str(self.id) + '. ' + self.name
        
    class Meta:
        app_label = "uploads"
        
class UploadType(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return str(self.id) + '. ' + self.name
    
    class Meta:
        app_label = "uploads"
        
class ErrorCode(models.Model):
    name                  = models.CharField(max_length=255)
    description           = models.CharField(max_length=2000, null=True, blank=True)
    def __unicode__(self):
        return str(self.id) + ': ' + self.name
        
    class Meta:
        app_label = "uploads"