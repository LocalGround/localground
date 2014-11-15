from rest_framework import serializers
    
class TablePhotoJSONField(serializers.WritableField):
    type_label = 'json'
    
    def to_native(self, obj):
        if obj is None:
            return None
        #return obj.id
        return {
            'id': obj.id,
            'file_name_medium_sm': obj.encrypt_url(obj.file_name_medium_sm),
            'file_name_small': obj.encrypt_url(obj.file_name_small)
        }
    
class TableAudioJSONField(serializers.WritableField):
    type_label = 'json'
    
    def to_native(self, obj):
        if obj is None:
            return None
        return {
            'id': obj.id,
            'file_path': obj.encrypt_url(obj.file_name_new) 
        }