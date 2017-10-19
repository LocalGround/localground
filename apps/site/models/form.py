from django.contrib.gis.db import models
from django.db.models import Q
from localground.apps.site.managers import FormManager
from localground.apps.site.models import NamedMixin, BaseAudit, \
    ObjectPermissionsMixin, ProjectMixin
from localground.apps.site.dynamic import ModelClassBuilder, DynamicFormBuilder
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


class Form(NamedMixin, ProjectMixin, ObjectPermissionsMixin, BaseAudit):
    table_name = models.CharField(max_length=255, unique=True)
    objects = FormManager()
    _model_class = None
    _data_entry_form_class = None
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
            try:
                del app_models[self.TableModel._meta.model_name]
            except:
                pass

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
            try:
                del app_models[self.TableModel._meta.model_name]
            except:
                pass

        reload(import_module(settings.ROOT_URLCONF))
        clear_url_caches()
        apps.clear_cache()
        self._fields = None

    @property
    def TableModel(self):
        return ModelClassBuilder(self).model_class

    def has_access(self, user, access_key=None):
        self.can_view(user, access_key=access_key)

    def sync_db(self):
        mcb = ModelClassBuilder(self)
        mcb.sync_db()

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
                self.owner.username.lower(), generic.generateID(num_digits=10))

        if user:
            self.last_updated_by = user
        self.time_stamp = get_timestamp_no_milliseconds()
        super(Form, self).save(*args, **kwargs)

        if is_new:
            self.sync_db()

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
            transaction.rollback()
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
