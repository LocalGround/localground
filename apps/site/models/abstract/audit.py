from django.contrib.gis.db import models
from localground.apps.site.models.abstract.base import Base
from localground.apps.lib.helpers import get_timestamp_no_milliseconds

class BaseAudit(Base):
    owner = models.ForeignKey('auth.User',)
    last_updated_by = models.ForeignKey('auth.User', related_name="%(app_label)s_%(class)s_related")
    date_created = models.DateTimeField(default=get_timestamp_no_milliseconds)
    time_stamp = models.DateTimeField(default=get_timestamp_no_milliseconds,
                                                    db_column='last_updated')
    class Meta:
        app_label = 'site'
        abstract = True
        
    @classmethod
    def filter_fields(cls):
        from localground.apps.lib.helpers import QueryField, FieldTypes
        return [
            QueryField('owner__username', id='owned_by', title='Owned By'),
            QueryField('date_created', id='date_created_after', title='After',
                                        data_type=FieldTypes.DATE, operator='>='),
            QueryField('date_created', id='date_created_before', title='Before',
                                        data_type=FieldTypes.DATE, operator='<=')
        ]
        
    @classmethod
    def get_field_by_name(cls, name, operator='='):
        for f in cls.filter_fields():
            if f.col_name == name and f.operator.lower() == operator.lower():
                return f
        return None