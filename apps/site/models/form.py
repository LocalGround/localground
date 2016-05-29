from django.contrib.gis.db import models
from django.db.models import Q
from localground.apps.site.managers import FormManager
from localground.apps.site.models import Field, ProjectMixin, \
    BaseNamed, DataType, Project, BasePermissions
from localground.apps.site.dynamic import ModelClassBuilder, DynamicFormBuilder
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


class Form(BaseNamed, BasePermissions):
    slug = models.SlugField(
        verbose_name="Friendly URL",
        max_length=100,
        db_index=True,
        help_text='A few words, separated by dashes "-", to be used as part of the url',
        blank=False)
    table_name = models.CharField(max_length=255, unique=True)
    projects = models.ManyToManyField('Project')
    objects = FormManager()
    _model_class = None
    _data_entry_form_class = None
    filter_fields = BaseNamed.filter_fields + ('slug',)

    class Meta:
        app_label = 'site'
        verbose_name = 'form'
        verbose_name_plural = 'forms'
        unique_together = ('slug', 'owner')

    def can_view(self, user=None, access_key=None):
        # check user it has object permissions:
        has_object_permissions = super(
            Form,
            self).can_view(
            user=user,
            access_key=access_key)
        if has_object_permissions:
            return True

        # if s/he doesn't, check if user has project permissions:
        for p in self.projects.all():
            if p.can_view(user=user, access_key=access_key):
                return True
        return False

    def can_edit(self, user):
        # check user it has object permissions:
        has_object_permissions = super(Form, self).can_edit(user)
        if has_object_permissions:
            return True

        # if s/he doesn't, check if user has project permissions:
        for p in self.projects.all():
            if p.can_edit(user):
                return True
        return False

    def can_manage(self, user):
        # check user it has object permissions:
        has_object_permissions = super(Form, self).can_manage(user)
        if has_object_permissions:
            return True

        # if s/he doesn't, check if user has project permissions:
        for p in self.projects.all():
            if p.can_manage(user):
                return True
        return False

    @classmethod
    def inline_form(cls, user):
        from localground.apps.site.forms import FormInlineUpdateForm

        return FormInlineUpdateForm

    @classmethod
    def get_form(cls):
        from localground.apps.site.forms import FormCreateForm

        return FormCreateForm

    @classmethod
    def sharing_form(cls):
        from localground.apps.site.forms import FormPermissionsForm

        return FormPermissionsForm

    @classmethod
    def create_form(cls, user):
        from django.forms import ModelForm

        class InlineForm(ModelForm):
            def __init__(self, *args, **kwargs):
                super(InlineForm, self).__init__(*args, **kwargs)
                from localground.apps.site import models

                self.fields[
                    "projects"].queryset = models.Project.objects.get_objects(user)
                self.fields["projects"].help_text = 'Give one or more of your projects \
									access to this form.  Users who have access to the \
									projects you select will also have access to this form.'

            class Meta:
                from django import forms
                from localground.apps.site.widgets import ArrayFieldTagWidget, CustomDateTimeWidget

                model = cls
                fields = ('name', 'description', 'tags', 'access_authority',
                          'slug', 'access_key', 'projects')
                widgets = {
                    'id': forms.HiddenInput,
                    'description': forms.Textarea(attrs={'rows': 3}),
                    'projects': forms.widgets.CheckboxSelectMultiple,
                    'tags': ArrayFieldTagWidget(attrs={'delimiter': ','})
                }

        return InlineForm

    @classmethod
    def cache_dynamic_models(cls):
        from django.conf import settings
        # Add Dynamic Models to cache:
        # Useful link:  https://dynamic-models.readthedocs.org/en/latest/pdfindex.html?highlight=re
        # Not sure where to call this...probably in a try/except block
        from localground.apps.site.models import Form
        from django.db.models.loading import cache
        from django.apps import apps
        # the prefetch_related really cuts down on queries...but the DYNAMIC_MODELS_CACHED
        # flag isn't working!  Need to come up w/something else
        forms = Form.objects.prefetch_related(
            'field_set',
            'field_set__data_type').all()
        for form in forms:
            m = form.TableModel
            
            #first remove from cache:
            app_models = apps.all_models[form.TableModel._meta.app_label]
            del app_models[form.TableModel._meta.model_name]
            
            # then register
            apps.register_model(m._meta.app_label, m)

    def clear_table_model_cache(self):
        # see: http://dynamic-models.readthedocs.org/en/latest/topics/model.html#topics-model
        from django.conf import settings
        from importlib import import_module
        from django.core.urlresolvers import clear_url_caches
        from django.apps import apps

        app_models = apps.all_models[self.TableModel._meta.app_label]
        if app_models.get(self.TableModel._meta.model_name):
            del app_models[self.TableModel._meta.model_name]
        
        reload(import_module(settings.ROOT_URLCONF))
        clear_url_caches()
        apps.clear_cache()
        self._fields = None

    @property
    def TableModel(self):
        return ModelClassBuilder(self).model_class

    def has_access(self, user, access_key=None):
        if self.access_authority.id == 3:
            return True
        elif self.access_authority.id == 2 and self.access_key == access_key:
            return True
        elif self.owner == user:
            return True
        else:
            from django.db.models import Q

            projects = self.projects.filter(Q(owner=user) |
                                            Q(users__user=user))
            return len(projects) > 0

    @property
    def DataEntryFormClass(self):
        if self._data_entry_form_class is None:
            dfb = DynamicFormBuilder(self)
            self._data_entry_form_class = dfb.data_entry_form_class
        return self._data_entry_form_class

    def sync_db(self):
        mcb = ModelClassBuilder(self)
        mcb.sync_db()

    def __unicode__(self):
        # return '%s - %s (%s)' % (self.id, self.name, self.table_name)
        return self.name

    def get_next_record(self, last_id=None):
        q = self.TableModel.objects.all()
        if last_id is not None:
            q = q.filter(id__gt=last_id)
        q = q.order_by('id', )
        if len(q) > 0:
            return q[0]

    @property
    def fields(self):
        if not hasattr(self, '_fields') or self._fields is None:
            self._fields = list(
                self.field_set.select_related('data_type').all()
                .order_by('ordering', )
            )
        return self._fields

    def get_fields(self, ordering='ordering', print_only=False):
        if print_only:
            fields = []
            for f in self.fields:
                fields.append(f)
            return fields
        return self.fields

    def get_model_class(self):
        mcb = ModelClassBuilder(self)
        return mcb.model_class

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
                self.owner.username, generic.generateID(num_digits=10))

        if user:
            self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(Form, self).save(*args, **kwargs)

        if is_new:
            self.sync_db()

    def get_snipped_field_names(self):
        names = []
        for n in self.fields:
            names.append(n.col_name)
        return names

    def to_dict(self, print_only=True):
        return dict(
            id=self.id,
            name=self.name,
            columns=[
                f.to_dict() for f in self.get_fields(
                    print_only=print_only)])

    def add_records_batch(self, list_of_dictionaries, user):
        total_num = 0
        batch_num = 500
        fields = self.fields

        def batches(dicts, batch_size):
            for i in range(0, len(dicts), batch_size):
                yield dicts[i:i+batch_size]

        for batch in batches(list_of_dictionaries, batch_num):
            with transaction.atomic():
                for d in batch:
                    self.add_record(d, user, fields=fields)
                total_num += len(batch)
                print('Committing the next %s records...' % len(batch))
            print('Committed %s records total.' % total_num)

    def add_record(self, dictionary, user, fields=None):
        d = dictionary
        e = self.TableModel()
        if fields is None:
            print('querying for fields...')
            fields = self.fields

        # populate content that exists for all dynamic tables:
        e.project = d.get('project')
        e.time_stamp = get_timestamp_no_milliseconds()
        e.owner = user
        e.point = d.get('point')
        e.mapimage = d.get('mapimage')
        e.last_updated_by = d.get('last_updated_by')

        # populate ad hoc columns (variable across tables):
        for n in fields:
            e.__setattr__(n.col_name, d.get(n.col_name))
        e.save(user=user)
        self.save(user=user)
        return e

    def update_record(self, dictionary, user):
        d = dictionary
        e = self.TableModel.objects.get(id=int(d.get('id')))
        for k, v in d.items():
            e.__setattr__(k, v)
        e.save()

    def delete_record(self, id, user):
        self._delete_records([self.TableModel.objects.get(id=id)])

    def delete_records_by_ids(self, id_list, user):
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.TableModel.objects.filter(id__in=id_list))
            num_deletes = self._delete_records(objects)
        return '%s records were deleted from the %s table.' % (
            num_deletes, self.name)

    def _delete_records(self, records):
        from django.forms.models import model_to_dict

        num_deletes = 0
        for r in records:
            d = model_to_dict(r)
            r.delete()
            num_deletes = num_deletes + 1
        return num_deletes

    def source_table_exists(self):
        from django.db import connection, transaction

        try:
            table_name = self.table_name
            cursor = connection.cursor()
            cursor.execute('select count(id) from  %s' % table_name)
            # if no error raised then table exists:
            return True
        except Exception:
            # Table doesn't exist
            transaction.rollback_unless_managed()
            return False

    def delete(self, destroy_everything=True, **kwargs):
        if destroy_everything:
            # drop the underlying table if it exists:
            if self.source_table_exists():
                from django.db import connection

                cursor = connection.cursor()
                cursor.execute('drop table %s' % self.table_name)
                cursor.close()

        # remove referenced ContentType
        try:
            from django.contrib.contenttypes.models import ContentType
            ct = ContentType.objects.get(model='form_%s' % self.id)
            ct.delete()
        except ContentType.DoesNotExist:
            pass
        
        self.clear_table_model_cache()
        super(Form, self).delete(**kwargs)
        
    def remove_table_from_cache(self):
        self.clear_table_model_cache()
