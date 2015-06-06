from rest_framework import serializers, metadata
from localground.apps.lib.helpers import QueryParser

class CustomMetadata(metadata.SimpleMetadata):
    
    def get_field_info(self, field):
        field_info = super(CustomMetadata, self).get_field_info(field)
        if hasattr(field, 'type_label'):
            field_info['type'] = field.type_label
        elif field.source == 'description':
            field_info['type'] = 'memo'
        return field_info
    
    
    def determine_metadata(self, request, view):
        metadata = super(CustomMetadata, self).determine_metadata(request, view)
        model = None
        if hasattr(view, 'get_queryset'):
            try:
                model = view.get_queryset().model
            except:
                try:
                    model = view.model
                except:
                    pass
            if model and hasattr(model, 'filterfields'):
                metadata['filters'] = [ff.to_dict() for ff in model.filter_fields()]
        return metadata
    