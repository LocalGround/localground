class FieldTypes(object):
    STRING = 'string'
    DATE = 'date'
    INTEGER = 'integer'
    TAG = 'tag'
    LIST = 'list'
    FLOAT = 'float'
    BOOLEAN = 'boolean'

class QueryField(object):
    django_operator_lookup = {
        'exact': '=',
        'gt': '>',
        'gte': '>=',
        'lt': '<',
        'lte': '<=',
        'icontains': 'LIKE',
        'in': 'IN'
    }
    
    @classmethod
    def get_field_from_alias(cls, model_class, alias):
        search_fields = model_class.get_filter_fields()
        #raise Exception(search_fields)
        return search_fields.get(alias)
    
    @classmethod
    def get_field_from_django_field(cls, model_class, django_fieldname):
        search_fields = model_class.get_filter_fields()
        for field in search_fields.values():
            if field.django_fieldname == django_fieldname:
                return field
        return None
        
        
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
        if self.operator.lower() == 'in':
            self.value = ', '.join(value)
        else:
            self.value = value
            
        
    def __repr__(self):
        return str(self.to_dict())
        
    def to_dict(self, col_name=True):
        d = {
            'django_fieldname': self.django_fieldname,
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
    
    def update_from_sql(self, where_conditions):
        if not where_conditions: return None
        for c in where_conditions.children:
            field_name = "__".join(c[0].split("__")[:-1])
            #field = QueryField.get_field_from_django_field(self.model_class, field_name)
            if field_name.lower() == self.django_fieldname.lower():
                self.operator = self.django_operator_lookup.get(c[0].split("__")[-1])
                self.set_value(c[1])
    
    
    