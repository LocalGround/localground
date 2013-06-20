from django.contrib.gis.db import models
from django.conf import settings
from localground.apps.uploads.managers import AudioManager
from localground.apps.site.lib.helpers.models import PointObject
from localground.apps.uploads.models import NamedUpload

class Audio(PointObject, NamedUpload):
    source_scan = models.ForeignKey('uploads.Scan', blank=True, null=True)
    source_marker = models.ForeignKey('overlays.Marker', blank=True, null=True)
    deleted = models.BooleanField(default=False)
    objects = AudioManager()
    
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
        app_label = "uploads"
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
