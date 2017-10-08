from django.contrib.gis.db import models
from django.http import Http404
from localground.apps.lib.helpers import classproperty
from django.contrib.contenttypes.models import ContentType

class Base(models.Model):
    filter_fields = ('id',)

    class Meta:
        app_label = 'site'
        abstract = True
        verbose_name = 'base'
        verbose_name_plural = 'bases'

    '''
    ----------------------------------------------------------------------------
    Private Class Methods
    ----------------------------------------------------------------------------
    '''
    @classmethod
    def __get_model_managed(cls, model_name=None, model_name_plural=None):
        if model_name is None and model_name_plural is None:
            raise Exception(
                'Either model_name or model_name_plural is required here.')

        from django.db.models import loading
        models = loading.get_models()
        if model_name_plural:
            for m in models:
                try:
                    if model_name_plural == m.model_name_plural:
                        return m
                except:
                    pass
        if model_name:
            for m in models:
                try:
                    if model_name == m.model_name:
                        return m
                except:
                    pass
        raise Http404

    '''
    ----------------------------------------------------------------------------
    Public Class Properties
    ----------------------------------------------------------------------------
    '''
    @classproperty
    def object_type(cls):
        return cls._meta.verbose_name

    @classproperty
    def model_name(cls):
        return cls._meta.verbose_name.replace('-', '_')

    @classproperty
    def pretty_name(cls):
        return cls._meta.verbose_name.replace('-', ' ')

    @classproperty
    def model_name_plural(cls):
        return cls._meta.verbose_name_plural

    @classproperty
    def pretty_name_plural(cls):
        return cls._meta.verbose_name_plural.replace('-', ' ')

    '''
    ----------------------------------------------------------------------------
    Public Static Methods
    ----------------------------------------------------------------------------
    '''
    @classmethod
    def get_model(cls, model_name=None, model_name_plural=None):
        '''
        Finds the corresponding model class, based on the arguments
        '''
        name = model_name or model_name_plural
        if name.find('form_') == -1:
            return cls.__get_model_managed(
                model_name=model_name,
                model_name_plural=model_name_plural)
        else:
            id = name.split('_')[-1]
            from localground.apps.site.models import Form
            form = Form.objects.get(id=id)
            return form.TableModel

    @classmethod
    def get_filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes

        def get_data_type(model_field):
            data_types = {
                'AutoField': FieldTypes.INTEGER,
                'ForeignKey': FieldTypes.INTEGER,
                'CharField': FieldTypes.STRING,
                'DateTimeField': FieldTypes.DATE,
                'PointField': FieldTypes.POINT,
                'TextField': FieldTypes.STRING,
                'BooleanField': FieldTypes.BOOLEAN,
                'NullBooleanField': FieldTypes.BOOLEAN,
                'ArrayField': 'list'
            }
            return data_types.get(model_field.get_internal_type()) or model_field.get_internal_type()
        query_fields = {}
        for field in cls.filter_fields:
            name = field
            if name == "description": name = "caption" #hack for API alignment.
            for f in cls._meta.fields:
                if f.name == field:
                    query_fields[name] = QueryField(
                        name, django_fieldname=f.name, title=f.verbose_name,
                        help_text=f.help_text, data_type=get_data_type(f)
                    )
        #raise Exception(query_fields)
        return query_fields

    @classmethod
    def get_content_type(cls):
        '''
        Finds the ContentType of the model (does a database query)
        Caching not really working...perhaps use application-level caching?
        '''
        return ContentType.objects.get_for_model(cls, for_concrete_model=False)
