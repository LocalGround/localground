#!/usr/bin/env python
from django.conf import settings

class DataTypes(object):
    STRING = 'string'
    DATE = 'date'
    INTEGER = 'integer'
    TAG = 'tag'

class FilterCondition(object):
    
    def __init__(self, col_name, id=None, title=None, date_type=None,
                        operator='=', conjunction='and', val=None):
        self.id = id
        self.col_name = col_name
        self.title = title
        self.data_type = date_type
        self.operator = operator
        self.conjunction = conjunction
        self.value = val
        if date_type is None:
            self.set_data_type(val)
        self.set_value(val)
        
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
    
    def set_data_type(self, val):
        #not all FilterFields will have values
        if val is None: return
        
        #but if there are values, figure out the data type:
        if val[0] == '\'' and val[-1] == '\'':
            self.data_type = DataTypes.STRING
        else:
            self.data_type = DataTypes.INTEGER
        if self.col_name.find('tag') != -1:
            self.data_type = DataTypes.TAG
        if self.col_name.find('date') != -1:
            self.data_type = DataTypes.DATE    
        
    def set_value(self, val):
        #not all FilterFields will have values
        if val is None: return
        
        from datetime import datetime
        self.value = val
        if self.data_type in [DataTypes.STRING, DataTypes.TAG, DataTypes.DATE]:
            #trim single quotes off of either side:
            self.value = self.value[1:-1]
        elif self.data_type == DataTypes.INTEGER:
            self.value = int(self.value)
        if self.data_type == DataTypes.DATE:
            self.value = datetime(2006, 11, 21, 16, 30)
            '''
            for format in settings.DATE_INPUT_FORMATS:
                try:
                    self.value = datetime.strptime(self.value, format)
                    break
                except: pass
            '''
            
        
        
    def get_django_operator(self):
        lookup = {
            '=': '__icontains',
            '>': '__gt',
            '>=': '__gte',
            '<': '__lt',
            '<=': '__lte',
            'like': '__icontains',
        }
        return lookup[self.operator]
        
    def get_expression(self):
        d = {}
        col_name = '%s%s' % (self.col_name, self.get_django_operator())
        d[col_name] = self.value
        return d
    

class FilterQuery(object):
    error = False
    
    def __init__(self, filter_text):
        self.filter_text = filter_text
        self.filter_query = []
        self.parse()
        '''
        try:
            self.parse()
            self.error = False
        except:
            self.error = True
            self.error_message = 'Invalid query "%s"' % self.filter_text
        '''
        
    def __repr__(self):
        return 'Filter Text: %s\n%s' % (self.filter_text, self.to_dict_list(debug=True))
        
    def to_dict_list(self, debug=False):
        return [c.to_dict(debug=True) for c in self.filter_query]
        
    def parse(self):
        import re
        tokens = re.split('( and | or )', self.filter_text)
        tokens = [t.strip() for t in tokens]
        for i in range(0, len(tokens)):
            #even items are the conditions:
            if i % 2 == 0:
                items = [item.strip() for item in re.split('(<=|<|>=|>| in |!=|=)', tokens[i])]
                item = FilterCondition(items[0], operator=items[1], val=items[2])
                #odd items are the conjunctions
                if i > 1:
                    item.conjunction = tokens[i-1].strip()
                self.filter_query.append(item)
                
    def extend_query(self, q):
        from django.db.models import Q
        #from datetime import datetime, date
        #d = { 'date_created__gte': datetime.datetime(2006, 11, 21, 16, 30)}
        #q = q.filter(date_created__gte=datetime.date(2006, 11, 21))
        for c in self.filter_query:
            q = q.filter(**c.get_expression())
        return q
        
        