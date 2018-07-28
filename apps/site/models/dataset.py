from django.contrib.gis.db import models
from django.db.models import Q
from localground.apps.site.managers import FormManager
from localground.apps.site.models import NamedMixin, BaseAudit, \
     ProjectMixin, Record, Field, DataType, Layer
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


class Dataset(NamedMixin, ProjectMixin, BaseAudit):
    table_name = models.CharField(max_length=255, unique=True)
    objects = FormManager()
    filter_fields = BaseAudit.filter_fields + ('slug',)

    class Meta:
        app_label = 'site'
        verbose_name = 'dataset'
        verbose_name_plural = 'datasets'

    def has_access(self, user, access_key=None):
        self.can_view(user, access_key=access_key)

    def __unicode__(self):
        return self.name

    @classmethod
    def _generate_name(cls, project):
        import re
        datasets = cls.objects.filter(project=project)
        try:
            names = map(lambda dataset: dataset.name, datasets)
            matched = filter(lambda x: x.find('Dataset') != -1, names)
            numbers = map(lambda x: re.findall(r'(\d+)', x), matched)
            numbers = reduce(lambda x, y: x + y, numbers)
            numbers = map(lambda x: int(x), numbers)
            try:
                number = max(*numbers) + 1
            except Exception:
                number = 2
            return 'Untitled Dataset {0}'.format(number)
        except Exception:
            return 'Untitled Dataset 1'

    @classmethod
    def create(cls, **kwargs):
        dataset = cls.objects.create(
            owner=kwargs.get('owner'),
            name=kwargs.get('name', cls._generate_name(
                kwargs.get('project'))),
            last_updated_by=kwargs.get('last_updated_by'),
            project=kwargs.get('project')
        )

        # In addition to creating the new dataset, also create two new fields
        # for free: Name and description
        data_type = DataType.objects.get(id=1)
        i = 1
        for alias in ['Name', 'Description']:
            Field.objects.create(
                col_alias=alias,
                data_type=data_type,
                ordering=i,
                # is_display_field=(i == 1),
                dataset=dataset,
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
            help_text='Project to which the dataset belongs',
            data_type=FieldTypes.STRING
        )
        return query_fields

    @property
    def fields(self):
        return list(
            self.field_set.select_related('data_type').all()
            .order_by('ordering', )
        )

    def get_linked_layers(self):
        return Layer.objects.filter(dataset=self)

    def get_records(self):
        return Record.objects.get_objects_with_lists(dataset=self)

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
        super(Dataset, self).save(*args, **kwargs)

    def delete(self, destroy_everything=True, **kwargs):
        # Ensure that dataset is not deleted if there are layers linking to it:
        if len(self.get_linked_layers()) > 0:
            msg = 'This dataset cannot be removed because it is currently '
            msg += 'being used by the following maps: {0}'.format(
                ', '.join(map(
                    lambda layer: '"{0}: {1}"'.format(
                        layer.styled_map.id, layer.styled_map.name),
                    self.get_linked_layers()
                ))
            )
            raise Exception(msg)
        else:
            super(Dataset, self).delete(**kwargs)
