from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.utils.model_meta import _resolve_model

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