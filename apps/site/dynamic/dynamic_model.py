from localground.apps.site.models import BasePointMixin, BaseAudit, ProjectMixin
from localground.apps.site.managers import RecordManager
from django.contrib.contenttypes.models import ContentType
from django.contrib.gis.db import models
from datetime import datetime
#from django.db.models.loading import cache
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.models import Field
# http://stackoverflow.com/questions/3712688/creation-of-dynamic-model-fields-in-django
# https://code.djangoproject.com/wiki/DynamicModels
'''
Important TODO:
Since Tables now inherit form BaseAudit, we'll need to write a batch script that
adds the auditing columns to the user-generated tables.
'''


class DynamicModelMixin(BasePointMixin, BaseAudit):
    project = models.ForeignKey('Project')
    filter_fields = BaseAudit.filter_fields + ('project',)
    objects = RecordManager()

    class Meta:
        abstract = True

    def __str__(self):
        return '%s, Rec #%s' % (self._meta.object_name.lower(), self.id)

    def __repr__(self):
        return '<%s>' % self.__str__()

    @property
    def form(self):
        if not hasattr(self, '_form'):
            from localground.apps.site.models import Form

            self._form = (Form.objects
                          # .prefetch_related('field_set', 'field_set__data_type')
                          .get(table_name=self._meta.db_table)
            )
        return self._form

    @property
    def dynamic_fields(self):
        if not hasattr(self, '_fields'):
            self._fields = self.form.fields
        return self._fields

    def can_view(self, user, access_key=None):
        return (
            self.project.can_view(user=user, access_key=access_key)
            or
            self.form.can_view(user=user, access_key=access_key)
        )

    def can_edit(self, user):
        return self.project.can_edit(user) or self.form.can_edit(user)

    def get_dynamic_data(self):
        data = []
        for descriptor in self.dynamic_fields:
            data.append(self.__getattribute__(descriptor.col_name))
        return data

    def get_widget(self, field_name):
        return self.__getattribute__(field_name).widget

    def get_dynamic_data_default(self):
        data = []
        for descriptor in self.dynamic_fields:
            field_transcribed = self.__getattribute__(descriptor.col_name)
            data.append(field_transcribed)
        return data

    def to_dict(self, include_project=False, include_marker=True,
                include_data=False, include_mapimage=False, **kwargs):
        d = dict(
            form_id=self.form.id,
            id=self.id
            )
        if self.point is not None:
            d.update(dict(lat=self.point.y, lng=self.point.x))
        if include_project:
            d.update(dict(project=self.project.to_dict()))
        else:
            d.update(dict(project_id=self.project.id))
        
        if include_data:
            data = []

            # add the rest of the dynamic content:
            for descriptor in self.dynamic_fields:
                field = dict(
                    col_name=descriptor.col_name,
                    col_alias=descriptor.col_alias,
                    value=self.__getattribute__(descriptor.col_name)
                )
                if isinstance(field['value'], datetime):
                    field['value'] = field['value'].strftime(
                        '%m/%d/%Y, %I:%M:%S %p')
                data.append(field)
                if descriptor.is_display_field:
                    d.update(dict(name=field['value']))
                if d.get('name') is None:
                    d.update(dict(name='Record Id #%s' % self.id))
            d.update(dict(fields=data))

        return d

    def to_dict_lite(self, **kwargs):
        d = dict(
            form_id=self.form_id,
            id=self.id
        )
        if self.point is not None:
            d.update(dict(lat=self.point.y, lng=self.point.x))
        if self.source_marker is not None:
            d.update(dict(markerID=self.source_marker.id))
        # add dynamic data:
        data = []
        for descriptor in self.dynamic_fields:
            val = self.__getattribute__(descriptor.col_name)
            if isinstance(val, datetime):
                val = val.strftime('%m/%d/%Y, %I:%M:%S %p')
            data.append(val)
        d.update(dict(fields=data))
        return d


class ModelClassBuilder(object):
    def __init__(self, form):
        self.name = 'form_%s' % form.id
        self.form = form
        self.app_label = 'site'
        # needs to be unique
        self.module = 'localground.apps.site.models.%s' % form.table_name
        self.options = options = {
            'ordering': ['id'],
            'verbose_name': 'form_%s' % form.id,  # form.table_name,
            'verbose_name': 'form_%s' % form.id,
            'db_table': form.table_name
        }
        self.additional_fields = {}
        self.dynamic_fields = {}
        self._model_class = None

    @property
    def model_class(self):
        # if self._model_class is None:
        self.add_dynamic_fields_to_model()

        class ModelClassBuilder:
            pass

        if self.app_label:
            # app_label must be set using the Meta inner class
            setattr(ModelClassBuilder, 'app_label', self.app_label)

        # Update Meta with any options that were provided
        if self.options is not None:
            for key, value in self.options.iteritems():
                setattr(ModelClassBuilder, key, value)

        # Set up a dictionary to simulate declarations within a class
        '''
        try:
            del cache.app_models[self.app_label][self.name.lower()]
        except KeyError:
            pass
        except AttributeError:
            pass
        '''
        attrs = {'__module__': self.module, 'Meta': ModelClassBuilder}

        # Add in any fields that were provided
        attrs.update(self.additional_fields)
        attrs.update({
            'filter_fields': DynamicModelMixin.filter_fields + tuple(self.dynamic_fields.keys())
        })



        '''
        -------------------
        Begin Model Methods
        -------------------
        '''

        def save(self, user, *args, **kwargs):
            is_new = self.pk is None

            # 1. ensure that user doesn't inadvertently change the data type of
            # the column
            if is_new:
                self.owner = user
                self.date_created = get_timestamp_no_milliseconds()
            self.last_updated_by = user
            self.time_stamp = get_timestamp_no_milliseconds()
            # self.project = self.form.project
            super(self.__class__, self).save(*args, **kwargs)

        @classmethod
        def filter_fields(cls):
            from localground.apps.lib.helpers import QueryField, FieldTypes
            query_fields = [
                QueryField(
                    'project__id',
                    id='project_id',
                    title='Project ID',
                    data_type=FieldTypes.INTEGER),
                #QueryField('col_4', title='col_4', operator='like'),
                QueryField('date_created', id='date_created_after', title='After',
                           data_type=FieldTypes.DATE, operator='>='),
                QueryField('date_created', id='date_created_before', title='Before',
                           data_type=FieldTypes.DATE, operator='<=')
            ]
            for n in self.form.fields:
                if n.data_type.id == Field.DataTypes.TEXT:
                    query_fields.append(
                        QueryField(
                            n.col_name,
                            title=n.col_alias,
                            operator='like'))
                elif n.data_type.id in [Field.DataTypes.INTEGER, Field.DataTypes.RATING]:
                    query_fields.append(
                        QueryField(
                            n.col_name,
                            title=n.col_alias,
                            data_type=FieldTypes.INTEGER))
                elif n.data_type.id == Field.DataTypes.DATETIME:
                    query_fields.append(
                        QueryField(
                            n.col_name,
                            title=n.col_alias,
                            data_type=FieldTypes.DATE))
                elif n.data_type.id == Field.DataTypes.BOOLEAN:
                    query_fields.append(
                        QueryField(
                            n.col_name,
                            title=n.col_alias,
                            data_type=FieldTypes.BOOLEAN))
                elif n.data_type.id == Field.DataTypes.DECIMAL:
                    query_fields.append(
                        QueryField(
                            n.col_name,
                            title=n.col_alias,
                            data_type=FieldTypes.FLOAT))
            return query_fields

        attrs.update(dict(
            save=save,
            #filter_fields=('id', 'name')
        ))
        
        # --------------------------------------------------
        # remove model from  application cache, if it exists
        # --------------------------------------------------
        from django.apps import apps
        app_models = apps.all_models[self.app_label]
        if app_models.get(self.name):
            del app_models[self.name]
        # --------------------------------------------------

        # Create the class, which automatically triggers ModelBase processing
        self._model_class = type(self.name, (DynamicModelMixin, ), attrs)
        return self._model_class

    def add_dynamic_fields_to_model(self):
        # read field specifications and build dynamic fields:
        field = None
        for n in self.form.fields:
            kwargs = {
                'blank': True,
                'null': True,
                'verbose_name': n.col_alias,
                'db_column': n.col_name_db
            }
            if n.data_type.id == Field.DataTypes.TEXT:
                field = models.CharField(max_length=1000, **kwargs)
            elif n.data_type.id in [Field.DataTypes.INTEGER, Field.DataTypes.RATING]:
                field = models.IntegerField(**kwargs)
            elif n.data_type.id == Field.DataTypes.DATETIME:
                field = models.DateTimeField(**kwargs)
            elif n.data_type.id == Field.DataTypes.BOOLEAN:
                field = models.NullBooleanField(**kwargs)
            elif n.data_type.id == Field.DataTypes.DECIMAL:
                field = models.FloatField(**kwargs)
            elif n.data_type.id == Field.DataTypes.PHOTO:
                field = models.ForeignKey(
                    'Photo',
                    null=True,
                    blank=True,
                    db_column=n.col_name_db
                )
                # raise Exception(field)
            elif n.data_type.id == Field.DataTypes.AUDIO:
                field = models.ForeignKey(
                    'Audio',
                    null=True,
                    blank=True,
                    db_column=n.col_name_db
                )

            # add dynamic field:
            self.dynamic_fields.update({
                n.col_name: field
            })
        self.additional_fields.update(self.dynamic_fields)

    def sync_db(self):
        # This function uses the same code that's used in syncdb to dynamically
        # execute DDL sql on-the-fly.  Copied from:
        # /usr/local/lib/python2.6/dist-packages/django/core/management/commands/syncdb.py
        
        from django.core.management.color import no_style
        from django.db import connection, transaction

        tables = connection.introspection.table_names()

        if self.model_class._meta.db_table in tables:
            # don't create table if it already exists
            return

        seen_models = connection.introspection.installed_models(tables)
        created_models = set()
        pending_references = {}
        cursor = connection.cursor()
        sql, references = connection.creation.sql_create_model(
            self.model_class, no_style(), seen_models)
        seen_models.add(self.model_class)
        created_models.add(self.model_class)
        for refto, refs in references.items():
            pending_references.setdefault(refto, []).extend(refs)
            if refto in seen_models:
                sql.extend(
                    connection.creation.sql_for_pending_references(
                        refto,
                        no_style(),
                        pending_references))
        sql.extend(
            connection.creation.sql_for_pending_references(
                self.model_class,
                no_style(),
                pending_references))
        try:
            with transaction.atomic():
                errors_encountered = False
                for statement in sql:
                    cursor.execute(statement)

                # Install SQL indices for newly created model
                for model in seen_models:
                    if model in created_models:
                        index_sql = connection.creation.sql_indexes_for_model(
                            model,
                            no_style())
                        if index_sql:
                            for sql in index_sql:
                                cursor.execute(sql)
        except Exception:
            self.stderr.write("Failed to install index for %s.%s model: %s\n" %
                              (app_name, model._meta.object_name, e))

        #Add to ContentTypes also:
        
        from django.utils.encoding import smart_text

        ct = ContentType(
            name=smart_text(self.model_class._meta.verbose_name_raw),
            app_label=self.model_class._meta.app_label,
            model=self.model_class._meta.object_name.lower(),
        )
        ct.save()
