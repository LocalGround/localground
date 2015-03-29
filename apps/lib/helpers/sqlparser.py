#!/usr/bin/env python
from django.conf import settings
from localground.apps.lib import sqlparse
from localground.apps.lib.sqlparse import tokens as T
from localground.apps.lib.sqlparse.sql import Where, Comparison, Identifier
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
        #self.value = None
            
        
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
        #if self.value is not None:
        #d.update({ 'value': self.value })
        return d    

class WhereCondition(QueryField):
    
    def __init__(self, col_name, id=None, title=None, data_type=FieldTypes.STRING,
                                    operator='=', django_col_name=None,
                                    conjunction='AND', val=None):
        
        super(WhereCondition, self).__init__(col_name, id=id, title=title,
                                data_type=FieldTypes.STRING, operator=operator)
        self.conjunction = conjunction
        self.value_original = self.value = val
        self.parse_value(val)
        
    def __repr__(self):
        return str(self.to_dict(debug=True))
        
    def to_dict(self, debug=False):
        d = {
            'col_name': self.col_name,
            'data_type': self.data_type,
            'operator': self.operator,
            'conjunction': self.conjunction,
            'value': self.value
        }
        if debug:
            d.update({
                'id': self.id,
                'title': self.title,
                'expression': self.get_expression(),
                'django_operator': self.get_django_operator()
            })
        return d
    
    def update(self, query_field):
        self.id = query_field.id
        self.title = query_field.title
        #self.value = query_field.value
    
    def get_django_operator(self):
        sql_lookup = {
            '=': '__exact',
            '>': '__gt',
            '>=': '__gte',
            '<': '__lt',
            '<=': '__lte',
            'LIKE': '__icontains',
            'IN': '__in'
        }
        #not real sql operators, but help with the sql-to-django mapping:
        nonsql_lookup = {
            'STARTS': '__istartswith',
            'ENDS': '__iendswith'
        }
        lookup = {}
        lookup.update(sql_lookup)
        lookup.update(nonsql_lookup)
        return lookup[self.operator]
        
    def get_expression(self, cls=None):
        '''
        if cls is not None:
            #one last check to make sure the field being queried is valid:
            legitimate_field = cls.get_field_by_name(self.col_name, self.operator)
            if legitimate_field is None:
                raise Exception('The column name "%s" is invalid\n%s\n%s\n%s' % \
                                (self.col_name, str(cls.filter_fields()), self.col_name, self.operator))
        col_name = '%s%s' % (legitimate_field.django_col_name, self.get_django_operator())
        '''
        col_name = '%s%s' % (self.django_col_name, self.get_django_operator())
        if col_name.find('tags') != -1:
            return {'tags__regex': r'^(%s)' % '|'.join(['.*%s.*' % v for v in self.value]) }
        return { col_name: self.value}
    
    def parse_value(self, val):
        '''
        Based on the value of each query parameter, this method will detect
        and convert the parameter according to the appropriate data type.
        '''
        if val is None: return
        if isinstance(val, list):
            self.parse_list(val)
            return
        
        val = val.strip()
        if val[0] == '\'' and val[-1] == '\'':
            self.value = val[1:-1]
            self.data_type = FieldTypes.STRING
            if self.operator == 'LIKE':
                self.parse_like_clause()
            else:
                self.parse_date()
        else:
            self.parse_numeric(val)
        self.value_original = self.value
        return self.value
    
    def parse_list(self, val):
        '''
        converts the value to a list of values
        '''
        val = [self.parse_value(v) for v in val]
        self.value = val
        self.value_original = ', '.join([str(v) for v in val])
        self.data_type = FieldTypes.LIST
        
    def parse_like_clause(self):
        '''
        make the "like" operator django-compatible
        '''
        if self.value[0] == '%' and self.value[-1] == '%':
            self.value = self.value[1:-1]
        elif self.value[0] == '%':
            self.value = self.value[1:]
            self.operator = 'ENDS'
        elif self.value[-1] == '%':
            self.value = self.value[:-1]
            self.operator = 'STARTS'
        else:
            self.operator = '='
            
    def parse_date(self):
        '''
        Parses the value as a date, if applicable
        '''
        for format in settings.DATE_INPUT_FORMATS + settings.DATETIME_INPUT_FORMATS:
            try:
                self.value = datetime.strptime(self.value, format)
                self.data_type = FieldTypes.DATE
                break
            except: pass
            
    def parse_numeric(self, val):
        if val.find('.') != -1:
            try:
                self.value = float(val)
                self.data_type = FieldTypes.FLOAT
            except: pass
        else:
            try:
                self.value = int(val)
                self.data_type = FieldTypes.INTEGER
            except: pass
    
class OrderingCondition(QueryField):
    
    def __init__(self, col_name, id=None, title=None, data_type=FieldTypes.STRING,
                                    direction='asc'):
        
        super(WhereCondition, self).__init__(col_name, id=id, title=title,
                                data_type=FieldTypes.STRING, operator=None,
                                 django_col_name=None)

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
            field = self.get_field(filter_fields[i].col_name, filter_fields[i].operator)
            if field is not None:
                field.update(filter_fields[i])
                filter_fields[i] = field
        return filter_fields
    
    def to_dict_list(self):
        '''
        Populates the UI filter fields with data, if applicable
        '''
        fields = self.model_class.filter_fields()
        return [f.to_dict(col_name=True) for f in fields]
            
        
    
        
        
