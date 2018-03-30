from django.contrib.gis.db import models
from localground.apps.site.models import BaseAudit
from datetime import datetime
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from jsonfield import JSONField
from localground.apps.site.models import DataType


class Field(BaseAudit):
    form = models.ForeignKey('Form')
    col_name_db = models.CharField(max_length=255, db_column="col_name")
    col_alias = models.CharField(max_length=255, verbose_name="column name")
    data_type = models.ForeignKey('DataType')
    extras = JSONField(blank=True, null=True)
    ordering = models.IntegerField()

    def can_view(self, user=None, access_key=None):
        return self.form.can_view(user=user, access_key=access_key)

    def can_edit(self, user):
        return self.form.can_edit(user)

    def can_manage(self, user):
        return self.form.can_manage(user)

    def to_dict(self):
        return dict(alias=self.col_alias, id=self.id)

    def __unicode__(self):
        return '{0}. {1}'.format(self.id, self.col_alias)

    def __str__(self):
        return self.col_alias

    def toJSON(self):
        return {
            'id': self.id,
            'ordering': self.ordering,
            'col_alias': self.col_alias,
            'col_name': self.col_name
        }

    @property
    def col_name(self):
        import re
        # strip non-alpha-numeric characters (except spaces and dashes):
        tmp = re.sub(r'([^-^\s\w]|_)+', '', self.col_alias)

        # replace spaces and dashes with underscores:
        return str(re.sub(r'([-\s])+', '_', tmp).lower())

    class Meta:
        app_label = 'site'
        verbose_name = 'field'
        verbose_name_plural = 'fields'
        ordering = ['form__id', 'ordering']
        unique_together = (('col_alias', 'form'), ('col_name_db', 'form'))

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            import random
            random_string = ''.join(
                random.sample('0123456789abcdefghijklmnopqrstuvwxyz', 8))
            self.date_created = get_timestamp_no_milliseconds()
            self.col_name_db = 'col_placeholder_' + random_string
        else:
            o = Field.objects.get(id=self.id)
            if o.data_type != self.data_type:
                raise Exception(
                    'You are not allowed to change the column type of an ' +
                    'existing column')

        self.time_stamp = get_timestamp_no_milliseconds()
        super(Field, self).save(*args, **kwargs)

        # 2. ensure that the column name is unique, and add column to table:
        if is_new:
            self.col_name_db = 'col_%s' % self.id
            super(Field, self).save(update_fields=['col_name_db'])
