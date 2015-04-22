from rest_framework import serializers
    
class TablePhotoJSONField(serializers.Field):
    type_label = 'json'
    
    def to_representation(self, obj):
        if obj is None:
            return None
        #return obj.id
        return {
            'id': obj.id,
            'file_name_medium_sm': obj.encrypt_url(obj.file_name_medium_sm),
            'file_name_small': obj.encrypt_url(obj.file_name_small),
            'file_name_medium': obj.encrypt_url(obj.file_name_medium)
        }
    
class TableAudioJSONField(serializers.Field):
    type_label = 'json'
    
    def to_representation(self, obj):
        if obj is None:
            return None
        return {
            'id': obj.id,
            'file_path': obj.encrypt_url(obj.file_name_new) 
        }