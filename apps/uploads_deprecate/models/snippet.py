from django.contrib.gis.db import models
from localground.apps.uploads.managers import SnippetManager
from localground.apps.helpers.models import PointObject
from localground.apps.uploads.models import Upload

class Snippet(Upload, PointObject):
    source_attachment   = models.ForeignKey('uploads.Attachment')
    shape_string_json   = models.CharField(max_length=512, blank=True)
    is_blank            = models.BooleanField(default=False)
    objects             = SnippetManager()
    
    @property
    def file_name_new(self):
        return self.file_name_orig
    
    class Meta:
        app_label = "uploads"
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