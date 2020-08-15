from rest_framework.relations import PrimaryKeyRelatedField

def _resolve_model(obj):	
    """	
    Resolve supplied `obj` to a Django model class.	
    `obj` must be a Django model class itself, or a string	
    representation of one.  Useful in situations like GH #1225 where	
    Django may not have resolved a string-based reference to a model in	
    another model's foreign key definition.	
    String representations should have the format:	
        'appname.ModelName'	
    """	
    if isinstance(obj, six.string_types) and len(obj.split('.')) == 2:	
        app_name, model_name = obj.split('.')	
        resolved_model = apps.get_model(app_name, model_name)	
        if resolved_model is None:	
            msg = "Django did not return a model for {0}.{1}"	
            raise ImproperlyConfigured(msg.format(app_name, model_name))	
        return resolved_model	
    elif inspect.isclass(obj) and issubclass(obj, models.Model):	
        return obj	
    raise ValueError("{0} is not a Django model".format(obj))

class CustomModelField(PrimaryKeyRelatedField):
    '''
        This is a serious hack that is intended to patch together the
        ForeignKeyModelField functionality offered by the rest_framework.relations
        classes + the ability to add a custom type_label for the metadata OPTIONS
        request.
    '''
    type_label = 'field'
    
    def __init__(self, *args, **kwargs):
        try:
            self.type_label = kwargs.pop('type_label')
        except KeyError:
            raise ValueError("CustomModelField requires 'type_label' kwarg")
        try:
            model_field = kwargs.pop('model_field')
        except KeyError:
            raise ValueError("CustomModelField requires 'model_field' kwarg")
        
        related_model = _resolve_model(model_field.rel.to)
        kwargs = {
            'queryset': related_model._default_manager
            #,
            #'many': False
        }
        if model_field:
            kwargs['required'] = not(model_field.null or model_field.blank)
            
        super(CustomModelField, self).__init__(**kwargs)