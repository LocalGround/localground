from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base
from localground.apps.lib.helpers import get_timestamp_no_milliseconds


class BaseAudit(Base):
    owner = models.ForeignKey('auth.User',)
    last_updated_by = models.ForeignKey(
        'auth.User',
        related_name="%(app_label)s_%(class)s_related")
    date_created = models.DateTimeField(default=get_timestamp_no_milliseconds)
    time_stamp = models.DateTimeField(default=get_timestamp_no_milliseconds,
                                      db_column='last_updated')
    filter_fields = Base.filter_fields + ('date_created', 'time_stamp')
    
    @classmethod
    def get_filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes
        query_fields = super(BaseAudit, cls).get_filter_fields()
        query_fields['owner'] = QueryField(
            'owner', django_fieldname='owner__username', title='owner',
            help_text='Username of user who owns the project',
            data_type=FieldTypes.STRING
        )
        #raise Exception(query_fields)
        return query_fields

    class Meta:
        app_label = 'site'
        abstract = True
