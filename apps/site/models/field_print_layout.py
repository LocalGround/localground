from django.contrib.gis.db import models
from localground.apps.site.models import BaseAudit
from datetime import datetime
from localground.apps.lib.helpers import get_timestamp_no_milliseconds


class FieldLayout(BaseAudit):
    map_print = models.ForeignKey('Print')
    field = models.ForeignKey('Field')
    width = models.IntegerField()
    ordering = models.IntegerField()

    class Meta:
        app_label = 'site'
        verbose_name = 'field-layout'
        verbose_name_plural = 'field-layouts'
        ordering = ['map_print__id', 'ordering']
        unique_together = ('map_print', 'field')

    def save(self, user, *args, **kwargs):
        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            self.owner = user
            self.date_created = get_timestamp_no_milliseconds()

        self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(FieldLayout, self).save(*args, **kwargs)
