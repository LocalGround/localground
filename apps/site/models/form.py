from django.contrib.gis.db import models
from django.db.models import Q
from localground.apps.site.managers import FormManager
from localground.apps.site.models import NamedMixin, BaseAudit, \
     ProjectMixin, Record, Field, DataType
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


class Form(NamedMixin, ProjectMixin, BaseAudit):
    table_name = models.CharField(max_length=255, unique=True)
    objects = FormManager()
    filter_fields = BaseAudit.filter_fields + ('slug',)

    class Meta:
        app_label = 'site'
        verbose_name = 'form'
        verbose_name_plural = 'forms'

    def has_access(self, user, access_key=None):
        self.can_view(user, access_key=access_key)

    def __unicode__(self):
        return self.name

    @classmethod
    def create(cls, **kwargs):
        dataset = Form.objects.create(
            owner=kwargs.get('owner'),
            name=kwargs.get('name', 'Untitled Dataset'),
            last_updated_by=kwargs.get('last_updated_by'),
            project=kwargs.get('project')
        )

        # In addition to creating the new form, also create two new fields
        # for free: Name and description
        data_type = DataType.objects.get(id=1)
        i = 1
        for alias in ['Name', 'Description']:
            Field.objects.create(
                col_alias=alias,
                data_type=data_type,
                ordering=i,
                # is_display_field=(i == 1),
                form=dataset,
                owner=dataset.owner,
                last_updated_by=dataset.last_updated_by
            )
            i += 1
        return dataset

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

    @property
    def fields(self):
        return list(
            self.field_set.select_related('data_type').all()
            .order_by('ordering', )
        )

    def get_records(self):
        return Record.objects.filter(form=self)

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
