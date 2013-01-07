#!/usr/bin/env python
from django.contrib.gis.db import models
from datetime import datetime
from tagging_autocomplete.models import TagAutocompleteField

class BaseAudit(models.Model):
    created_by = models.ForeignKey('auth.User', db_column='user_id')
    last_updated_by = models.ForeignKey('auth.User')
    date_created = models.DateTimeField(default=datetime.now)
    time_stamp = models.DateTimeField(default=datetime.now, db_column='last_updated')
    
    class Meta:
        app_label = 'site'
        abstract = True

    @property
    def model_name(self):
        return self._meta.verbose_name

    @property
    def model_name_plural(self):
        return self._meta.verbose_name_plural
    
class BaseNamed(BaseAudit):
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    tags = TagAutocompleteField(blank=True, null=True)
    
    class Meta:
        app_label = 'site'
        abstract = True
        
class BaseMedia(BaseAudit):
    host = models.CharField(max_length=255)
    virtual_path = models.CharField(max_length=255)
    file_name_orig = models.CharField(max_length=255)
    content_type = models.CharField(max_length=50)
    
    class Meta:
        abstract = True
        app_label = 'site'
        
    def to_dict(self, **kwargs):
        raise NotImplementedError
    
    def get_absolute_path(self):
        return settings.FILE_ROOT + self.virtual_path
    
    def absolute_virtual_path(self):
        return absolute_virtual_path_orig(self)
        
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
        
class UploadedMedia(BaseMedia):
    file_name_new = models.CharField(max_length=255)
    attribution = models.CharField(max_length=500, blank=True,
                                   null=True, verbose_name="Author / Creator")
    
    class Meta:
        abstract = True
        app_label = 'site'
        
    def absolute_virtual_path(self):
        return self._encrypt_media_path(self.virtual_path + self.file_name_new)
        
    def _encrypt_media_path(self, path, host=None):
        if host is None:
            host = self.host
            #host = 'dev.localground.org' #for debugging
        from django.http import HttpResponse
        #return path
        return 'http://%s/profile/%s/%s/' % (host, self.model_name_plural, base64.b64encode(path))
         
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


