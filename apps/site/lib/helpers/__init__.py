#!/usr/bin/env python
from localground.apps.site.lib.helpers.emailer import Email
from localground.apps.site.lib.helpers.generic import FastPaginator, prep_paginator, generateID
from localground.apps.site.lib.helpers.sqlparser import FieldTypes, QueryField, \
                            WhereCondition, OrderingCondition, QueryParser
from localground.apps.site.lib.helpers.reports import Report
from localground.apps.site.lib.helpers.static_maps import OutputFormat, StaticMap
from localground.apps.site.lib.helpers.units import Units

def get_timestamp_no_milliseconds():
    from datetime import datetime, timedelta
    dt = datetime.now()
    return dt - timedelta(microseconds=dt.microsecond)

class classproperty(object):
    def __init__(self, getter):
        self.getter= getter
    def __get__(self, instance, owner):
        return self.getter(owner)  
