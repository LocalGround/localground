from django.contrib.gis.db import models
from django.conf import settings
from django.http import Http404
from localground.apps.lib.helpers import classproperty
from django.contrib.contenttypes.models import ContentType
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from localground.apps.site.models.abstract.mixins import NamedMixin, \
    ProjectMixin, MediaMixin
'''
This file contains the following abstract classes:
    * Base
    * BaseAudit
    * NamedMedia
    * UploadedMedia
'''


class Base(models.Model):
    filter_fields = ('id',)

    def __unicode__(self):
        return '{0}. {1}'.format(self.id, self.name)

    def __str__(self):
        return self.__unicode__()

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
                except Exception:
                    pass
        if model_name:
            for m in models:
                try:
                    if model_name == m.model_name:
                        return m
                except Exception:
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
        if name is None:
            raise Exception(
                'either model_name or model_name_plural argument is required'
            )
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
            return data_types.get(model_field.get_internal_type()) \
                or model_field.get_internal_type()

        query_fields = {}
        for field in cls.filter_fields:
            name = field
            if name == "description":
                name = "caption"  # hack for API alignment
            for f in cls._meta.fields:
                if f.name == field:
                    query_fields[name] = QueryField(
                        name, django_fieldname=f.name, title=f.verbose_name,
                        help_text=f.help_text, data_type=get_data_type(f)
                    )
        return query_fields

    @classmethod
    def get_content_type(cls):
        '''
        Finds the ContentType of the model (does a database query)
        Caching not really working...perhaps use application-level caching?
        '''
        return ContentType.objects.get_for_model(cls, for_concrete_model=False)


class BaseAudit(Base):
    owner = models.ForeignKey('auth.User',)
    last_updated_by = models.ForeignKey(
        'auth.User',
        related_name="%(app_label)s_%(class)s_related")
    date_created = models.DateTimeField(default=get_timestamp_no_milliseconds)
    time_stamp = models.DateTimeField(default=get_timestamp_no_milliseconds,
                                      db_column='last_updated')
    filter_fields = Base.filter_fields + \
        ('date_created', 'time_stamp', 'owner')

    def get_storage_location(self):
        return '/{0}/{1}/{2}/'.format(
            settings.AWS_S3_MEDIA_BUCKET,
            self.owner.username,
            self.model_name_plural
        )

    @classmethod
    def get_filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes
        query_fields = super(BaseAudit, cls).get_filter_fields()
        query_fields['owner'] = QueryField(
            'owner', django_fieldname='owner__username', title='owner',
            help_text='Username of user who owns the project',
            data_type=FieldTypes.STRING
        )
        # raise Exception(query_fields)
        return query_fields

    class Meta:
        app_label = 'site'
        abstract = True


class BaseUploadedMedia(MediaMixin, NamedMixin, ProjectMixin, BaseAudit):
    file_name_new = models.CharField(max_length=255)
    attribution = models.CharField(
        max_length=500, blank=True,
        null=True,
        verbose_name="Author / Creator",
        help_text="Name of the person who created the media file (text)"
    )
    filter_fields = MediaMixin.filter_fields + \
        ('name', 'description', 'tags', 'attribution', 'point')

    class Meta:
        abstract = True
        app_label = 'site'
