from rest_framework import serializers, metadata
from rest_framework.utils.field_mapping import ClassLookupDict

class CustomMetadata(metadata.SimpleMetadata):
    
    def get_field_info(self, field):
        field_info = super(CustomMetadata, self).get_field_info(field)
        if hasattr(field, 'type_label'):
            field_info['type'] = field.type_label
        elif field.source == 'description':
            field_info['type'] = 'memo'
        return field_info