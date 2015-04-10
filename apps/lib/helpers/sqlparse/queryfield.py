class FieldTypes(object):
    STRING = 'string'
    DATE = 'date'
    INTEGER = 'integer'
    TAG = 'tag'
    LIST = 'list'
    FLOAT = 'float'
    BOOLEAN = 'boolean'
    POINT = 'point'

class QueryField(object):
    django_operator_lookup = {
        'exact': '=',
        'gt': '>',
        'gte': '>=',
        'lt': '<',
        'lte': '<=',
        'icontains': 'LIKE',
        'in': 'IN',
        'distance_lt': 'within'
    }
    
    @classmethod
    def get_field_from_alias(cls, model_class, alias):
        search_fields = model_class.get_filter_fields()
        return search_fields.get(alias)
        
    def __init__(self, col_name, id=None, title=None, data_type=None, operator='=',
                    django_fieldname=None, help_text=None):
        self.django_fieldname = django_fieldname
        self.col_name = col_name
        self.title = title
        self.data_type = data_type
        self.operator = operator
        #self.django_col_name = col_name
        self.help_text = help_text
        #if self.django_col_name is None:
        #    self.django_col_name = col_name
        self.value = None
    
    def set_value(self, value):
        if self.data_type == 'point':
            self.value = '({}, {}, {})'.format(value[0].x, value[0].y, int(value[1].m))
        elif self.operator.lower() == 'in':
            self.value = ', '.join(value)
        else:
            self.value = value
            
        
    def __repr__(self):
        return str(self.to_dict())
        
    def to_dict(self, col_name=True):
        d = {
            #'django_fieldname': self.django_fieldname,
            #'operator': self.operator,
            'title': self.title,
            'type': self.data_type
        }
        if col_name:
            d.update({
                'col_name': self.col_name   
            })
        if self.value is not None:
            d.update({ 'value': self.value })
        return d
    
    def update_from_sql(self, where_conditions):
        if not where_conditions: return None
        try:
            for c in where_conditions.children:
                field_name = "__".join(c[0].split("__")[:-1])
                #field = QueryField.get_field_from_django_field(self.model_class, field_name)
                if field_name.lower() == self.django_fieldname.lower():
                    operator = self.django_operator_lookup.get(c[0].split("__")[-1])
                    self.operator = operator or self.operator
                    self.set_value(c[1])
        except:
            # Todo: Q objects can be nested inside of Q objects (especially if you used
            # the "OR" conjunction. I need to write a tree traversal to implement
            # this correctly. Adding try/except block for now.
            pass
    
    
    