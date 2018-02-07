from django.contrib.gis.db import models
from django.db.models import Q
from localground.apps.site.managers import FormManager
from localground.apps.site.models import NamedMixin, BaseAudit, \
     ProjectMixin, Record
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


class Form(NamedMixin, ProjectMixin, BaseAudit):
    table_name = models.CharField(max_length=255, unique=True)
    objects = FormManager()
    filter_fields = BaseAudit.filter_fields + ('slug',)

    @classmethod
    def get_filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes
        query_fields = super(BaseAudit, cls).get_filter_fields()
        query_fields['project'] = QueryField(
            'project', django_fieldname='project', title='project',
            help_text='Project to which the form belongs',
            data_type=FieldTypes.STRING
        )
        return query_fields

    class Meta:
        app_label = 'site'
        verbose_name = 'form'
        verbose_name_plural = 'forms'

    def has_access(self, user, access_key=None):
        self.can_view(user, access_key=access_key)

    def __unicode__(self):
        # return '%s - %s (%s)' % (self.id, self.name, self.table_name)
        return self.name

    @property
    def fields(self):
        if not hasattr(self, '_fields') or self._fields is None:
            self._fields = list(
                self.field_set.select_related('data_type').all()
                .order_by('ordering', )
            )
        return self._fields

    def get_records(self):
        return Record.objects.filter(form=self)

    def get_fields(self, ordering='ordering', print_only=False):
        if print_only:
            fields = []
            for f in self.fields:
                fields.append(f)
            return fields
        return self.fields

    def save(self, user=None, *args, **kwargs):
        from localground.apps.lib.helpers import generic

        is_new = self.pk is None

        # 1. ensure that user doesn't inadvertently change the data type of the
        # column
        if is_new:
            if user and not hasattr(self, 'owner'):
                self.owner = user
            self.date_created = get_timestamp_no_milliseconds()
            self.table_name = 'table_%s_%s' % (
                self.owner.username.lower(), generic.generateID(num_digits=10))

        if user:
            self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(Form, self).save(*args, **kwargs)

    def delete(self, destroy_everything=True, **kwargs):
        super(Form, self).delete(**kwargs)
