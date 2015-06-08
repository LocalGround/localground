#!/usr/bin/env python
from localground.apps.lib.helpers.emailer import Email
from localground.apps.lib.helpers.generic import FastPaginator, prep_paginator, generateID
from localground.apps.lib.helpers.sqlparse.sqlparser import QueryParser
from localground.apps.lib.helpers.sqlparse.queryfield import FieldTypes, QueryField
from localground.apps.lib.helpers.reports import Report
from localground.apps.lib.helpers.static_maps import OutputFormat, StaticMap
from localground.apps.lib.helpers.units import Units

def get_timestamp_no_milliseconds():
    from datetime import datetime, timedelta
    dt = datetime.now()
    return dt - timedelta(microseconds=dt.microsecond)

class classproperty(object):
    def __init__(self, getter):
        self.getter= getter
    def __get__(self, instance, owner):
        return self.getter(owner)  
