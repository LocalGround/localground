from django.contrib.gis.db import models
from localground.apps.site.managers import SnippetManager
from localground.apps.site.models import BasePoint, BaseMedia


class Snippet(BasePoint, BaseMedia):
    source_attachment = models.ForeignKey('Attachment')
    shape_string_json = models.CharField(max_length=512, blank=True)
    is_blank = models.BooleanField(default=False)
    objects = SnippetManager()

    @property
    def file_name_new(self):
        return self.file_name_orig

    class Meta:
        app_label = 'site'
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
