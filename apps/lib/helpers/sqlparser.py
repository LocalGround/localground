#!/usr/bin/env python
from django.conf import settings
from localground.apps.lib.helpers.sql_djangoify import parser
from datetime import datetime

class FieldTypes(object):
    STRING = 'string'
    DATE = 'date'
    INTEGER = 'integer'
    TAG = 'tag'
    LIST = 'list'
    FLOAT = 'float'
    BOOLEAN = 'boolean'

class QueryField(object):
    def __init__(self, col_name, id=None, title=None, data_type=None, operator='=',
                    django_col_name=None):
        self.id = id
        self.col_name = col_name
        self.title = title
        self.data_type = data_type
        self.operator = operator
        self.django_col_name = col_name
        if self.django_col_name is None:
            self.django_col_name = col_name
        self.value = None
            
        
    def __repr__(self):
        return str(self.to_dict())
        
    def to_dict(self, col_name=True):
        d = {
            'id': self.id,
            'title': self.title,
            'operator': self.operator
        }
        if col_name:
            d.update({
                'col_name': self.col_name   
            })
        if self.value is not None:
            d.update({ 'value': self.value })
        return d 

class QueryParser(object):
    error = False
    
    def __init__(self, model_class, query_text, debug=True):
        self.model_class = model_class
        self.query_text = query_text
        self.where_conditions = []
        #raise Exception(query_text)
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
        self.where_conditions = parser.parse_sql(self.query_text)
             
    def extend_query(self, q):
        if self.where_conditions:
            return q.filter(self.where_conditions)
        else:
            return q
    
    def populate_filter_fields(self):
        '''
        Populates the UI filter fields with data, if applicable
        '''
        filter_fields = self.model_class.filter_fields()
        for i in range(0, len(filter_fields)):
            filter_fields[i].value = self.get_field_value(filter_fields[i].col_name)
        return filter_fields

    def get_field_value(self, col_name):
        if not self.where_conditions:
            return None
        for c in self.where_conditions.children:
            field_name = "__".join(c[0].split("__")[:-1])
            if field_name.lower() == col_name.lower():
                return c[1]
        return None 
    
    def to_dict_list(self):
        '''
        Populates the UI filter fields with data, if applicable
        '''
        fields = self.model_class.filter_fields()
        return [f.to_dict(col_name=True) for f in fields]
 
