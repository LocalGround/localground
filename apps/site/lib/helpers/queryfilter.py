#!/usr/bin/env python
from django.conf import settings
from localground.apps.site.lib import sqlparse
from localground.apps.site.lib.sqlparse import tokens as T
from localground.apps.site.lib.sqlparse.sql import Where, Comparison, Identifier
from datetime import datetime

class DataTypes(object):
    STRING = 'string'
    DATE = 'date'
    INTEGER = 'integer'
    TAG = 'tag'
    LIST = 'list'
    FLOAT = 'float'

class FilterCondition(object):
    
    def __init__(self, col_name, id=None, title=None, date_type=None,
                        operator='=', conjunction='AND', val=None):
        self.id = id
        self.col_name = col_name
        self.title = title
        self.data_type = date_type
        self.operator = operator
        self.conjunction = conjunction
        self.value = val
        if val is not None:
            self.parse_value(val)
        #if date_type is None:
        #    self.set_data_type(val)
        #self.set_value(val)
        
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
    '''
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
        
        self.value = val
        if self.data_type in [DataTypes.STRING, DataTypes.TAG, DataTypes.DATE]:
            #trim single quotes off of either side:
            self.value = self.value[1:-1]
        elif self.data_type == DataTypes.INTEGER:
            self.value = int(self.value)
        if self.data_type == DataTypes.DATE:
            for format in settings.DATE_INPUT_FORMATS:
                try:
                    self.value = datetime.strptime(self.value, format)
                    break
                except: pass
    '''            
                
    def parse_value(self, val):
        if isinstance(val, list):
            val = [self.parse_value(v) for v in val]
            self.value = val
            self.data_type = DataTypes.LIST
            return self.value
        val = val.strip()
        if val[0] == '\'' and val[-1] == '\'':
            self.value = val[1:-1]
            self.data_type = DataTypes.STRING
            for format in settings.DATE_INPUT_FORMATS:
                try:
                    self.value = datetime.strptime(self.value, format)#.strftime('%Y-%m-%d')
                    self.data_type = DataTypes.DATE
                    break
                except: pass
        else:
            if val.find('.') != -1:
                try:
                    self.value = float(val)
                    self.data_type = DataTypes.FLOAT
                except: pass
            else:
                try:
                    self.value = int(val)
                    self.data_type = DataTypes.INTEGER
                except: pass
        return self.value
        
    def get_django_operator(self):
        lookup = {
            '=': '__icontains',
            '>': '__gt',
            '>=': '__gte',
            '<': '__lt',
            '<=': '__lte',
            'LIKE': '__icontains',
            'IN': '__in'
        }
        return lookup[self.operator]
        
    def get_expression(self):
        d = {}
        col_name = '%s%s' % (self.col_name, self.get_django_operator())
        d[col_name] = self.value
        return d
    

class FilterQuery(object):
    error = False
    CONJUNCTIONS = ['AND', 'OR']
    OPERATORS = ['=', '>', '>=', '<', '<=', 'LIKE', 'IN']
    
    def __init__(self, query_text, debug=True):
        self.query_text = query_text
        self.where_conditions = []
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
        
    def remove_whitespaces(self, tokens):
        stripped = []
        for t in tokens:
            if t.ttype != T.Whitespace: stripped.append(t)
        return stripped
    
    def parse(self):
        self.query_text = sqlparse.format(self.query_text, reindent=False, keyword_case='upper')
        statement = sqlparse.parse(self.query_text)[0]
        where_clause = None
        for i, t in enumerate(statement.tokens):
            if isinstance(t, Where):
                where_clause =  t
            #break
            
        tokens = self.remove_whitespaces(where_clause.tokens)
        tokens.pop(0)
        for i in range(0, len(tokens)):
            t = tokens[i]
            #parse equalities and inequalities:
            if isinstance(t, Comparison):
                children = [str(c) for c in self.remove_whitespaces(t.tokens)]
                fc = FilterCondition(children[0], operator=children[1], val=children[2])
                if i > 0: fc.conjunction = str(tokens[i-1])
                self.where_conditions.append(fc)
                
            elif t.ttype == T.Keyword:
                #parse "in" clauses:
                if str(t) == 'IN':
                    lst = str(self.remove_whitespaces(tokens[i+1].tokens)[1]).split(',')
                    fc = FilterCondition(str(tokens[i-1]), operator='IN', val=lst)
                    if i > 0: fc.conjunction = str(tokens[i-1])
                    self.where_conditions.append(fc)
                    
                #parse "like" clauses:
                elif str(t) == 'LIKE':
                    fc = FilterCondition(str(tokens[i-1]), operator='LIKE', val=str(tokens[i+1]))
                    if i > 0: fc.conjunction = str(tokens[i-1])
                    self.where_conditions.append(fc)
      
    '''
    def parse(self):
        self.query_text = sqlparse.format(self.query_text, reindent=False, keyword_case='upper')
        statement = sqlparse.parse(self.query_text)[0]
        where_clause = None
        tokens = self.remove_whitespaces(statement.tokens)
        for i, t in enumerate(tokens):
            if isinstance(t, Where):
                where_clause =  t
                break
                
        #print where_clause.tokens
        tokens = self.remove_whitespaces(where_clause.tokens)
        conjunctions = ['AND',]
        for i in range(0, len(tokens)):
            t = tokens[i]
            a = []
            # 1) saves the statement:
            if isinstance(t, Comparison):
                for e in t.tokens:
                    if isinstance(e, Identifier) or e.ttype == T.Operator.Comparison:
                        a.append(str(e))
                    if a[1] not in self.OPERATORS:
                        self.error = True
                        self.error_message = 'Only the following operators are \
                                             supported in the SQL interface: %s' % ', '.join(self.OPERATORS)
                        return
                self.where_conditions.append(FilterCondition(a[0], operator=a[1], val=a[2]))
            # 2) saves the conjunction
            if t.ttype == T.Keyword and len(self.where_conditions):
                c = str(t)
                if c not in ['AND', 'OR']:
                    self.error = True
                    self.error_message = 'Only the "AND" and the "OR" operators are supported in the SQL interface.'
                    return
                conjunctions.append(str(t))
        #combines the statement with the conjunction
        for i, condition in enumerate(self.where_conditions):
            condition.conjunction = conjunctions[i]
    '''
            
                
    def extend_query(self, q):
        from django.db.models import Q
        import operator
        args = Q(**self.where_conditions[0].get_expression())
        for i in range(1, len(self.where_conditions)):
            c = self.where_conditions[i]
            if c.conjunction == 'AND':
                args = args & Q(**c.get_expression())
            else: #OR condition:
                args = args | Q(**c.get_expression())
        q = q.filter(args) 
        return q
        
        