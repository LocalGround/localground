from rest_framework import serializers
import json
    
class EntitiesField(serializers.Field):
    type_label = 'json'
    type_name = 'EntitiesField'
    
    
    def get_attribute(self, obj):
        # We pass the object instance onto `to_representation`,
        # not just the field attribute.
        return obj
    
    
    def to_internal_value(self, value):
        '''
        This is a hack to do some pre-validation. The building of the
        GenericRelations must be done in the view itself (snapshot_views),
        b/c it needs access to the saved instance.
        '''
        import json
        if value:
            try:
                entities = json.loads(value)
            except:
                raise serializers.ValidationError('Error parsing JSON')

            for child in entities:
                try:
                    overlay_type = child['overlay_type']
                    ids = child['ids']
                except:
                    raise serializers.ValidationError(
                        '%s must have an overlay_type and an ids attribute' %
                        child)
                if not isinstance(ids, list):
                    raise serializers.ValidationError(
                        '%s must be a list' % ids
                    )

                for id in ids:
                    # ensure that the requested child item exists:
                    from localground.apps.site.models import Base
                    try:
                        obj = Base.get_model(
                            model_name=overlay_type
                        ).objects.get(id=id)
                    except:
                        raise serializers.ValidationError(
                            'No %s object exists with id=%s' % (
                                overlay_type,
                                id)
                        )
        # this exception prevents the 'entities' dictionary from being
        # directly applied to the entities many-to-many (which is impossible)
        # to specify before the object has been created.
        raise serializers.SkipField()
    
    def to_representation(self, obj):
        if obj.entities is not None:
            entity_dict = {}
            for e in obj.entities.all():
                overlay_type = e.entity_type.name
                if entity_dict.get(overlay_type) is None:
                    entity_dict[overlay_type] = []
                entity_dict[overlay_type].append(e.entity_id)

            entry_list = []
            for key in entity_dict:
                entry_list.append({
                    'overlay_type': key,
                    'ids': entity_dict[key]
                })
            return entry_list


class JSONField(serializers.Field):
    type_label = 'json'
    type_name = 'JSONField'

    def to_internal_value(self, data):
        try:
            d = json.loads(data)
            if isinstance(d, dict) or isinstance(d, list):
                return d
            else:
                raise serializers.ValidationError('Error parsing JSON')
        except:
            raise serializers.ValidationError('Error parsing JSON')
        return data

    def to_representation(self, value):
        if value is not None:
            if isinstance(value, dict) or isinstance(value, list):
                return value
            value = json.loads(value)
            if isinstance(value, dict) or isinstance(value, list):
                return value
            else:
                raise Exception('Error parsing JSON')
        return None

