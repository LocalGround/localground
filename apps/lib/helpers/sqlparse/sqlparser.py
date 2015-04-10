#!/usr/bin/env python
from django.conf import settings
from localground.apps.lib.helpers.sqlparse.sql_djangoify import parser
from datetime import datetime

class QueryParser(object):
    error = False
    
    def __init__(self, model_class, query_text, debug=True):
        self.model_class = model_class
        self.query_text = query_text
        self.where_conditions = []
        self.filter_fields = []
        if debug:
            self.parse()
        else:
            try:
                self.parse()
            except:
                self.error = True
                self.error_message = 'Invalid query "%s"' % self.query_text
        
    def __repr__(self):
        return 'Filter Text: %s\n%s' % (self.query_text, self.to_dict_list(debug=True))
        
    def __str__(self):
        return 'Filter Text: %s\n%s' % (self.query_text, self.to_dict_list(debug=True))
        
    def to_dict_list(self, debug=False):
        return [c.to_dict(debug=True) for c in self.where_conditions]
    
    def parse(self):
        if self.query_text is None:
            return
        self.where_conditions = parser.parse_sql(self.query_text, self.model_class)
             
    def extend_query(self, q):
        if self.where_conditions:
            return q.filter(self.where_conditions)
        else:
            return q
    
    def populate_filter_fields(self):
        '''
        Populates the UI filter fields with data, if applicable
        ''' 
        filter_fields = self.model_class.get_filter_fields().values()
        for filter_field in filter_fields:
            filter_field.update_from_sql(self.where_conditions)
        return filter_fields
    
    def to_dict_list(self):
        '''
        Populates the UI filter fields with data, if applicable
        '''
        fields = self.model_class.get_filter_fields().values()
        return [f.to_dict(col_name=True) for f in fields]
 
