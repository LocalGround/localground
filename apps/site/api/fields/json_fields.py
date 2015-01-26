from rest_framework import serializers
import json
    
class EntitiesField(serializers.WritableField):
    type_label = 'json'
    type_name = 'EntitiesField'

    def field_from_native(self, data, files, field_name, into):
        '''
        Alas, this doesn't cover it...only does most of the validation.
        To execute the actual database commit, you need to implement code
        in the view. Please see "snapshots_view" for details. A total hack.
        '''
        import json

        entities_str = data.get('entities')
        if entities_str:
            try:
                entities = json.loads(entities_str)
            except:
                raise serializers.ValidationError('Error parsing JSON')

            for child in entities:
                # validate each dictionary entry:
                try:
                    overlay_type = child['overlay_type']
                    #innerEntities = child['entities']
                    ids = child['ids']
                except:
                    raise serializers.ValidationError(
                        '%s must have an overlay_type and an ids attribute' %
                        child)
                if not isinstance(ids, list):
                    raise serializers.ValidationError(
                        '%s must be a list' % ids
                    )
                '''
                #Zack code...
                if not isinstance(innerEntities, list):
                    raise serializers.ValidationError(
                    '%s must be a list' % innerEntities
                    )
                '''

                # for entity in innerEntities:
                for id in ids:
                    # ensure that the requested child item exists:
                    from localground.apps.site.models import Base

                    try:
                        obj = Base.get_model(
                            model_name=overlay_type
                        ).objects.get(id=id)
                        # entity['id']
                    except:
                        raise serializers.ValidationError(
                            'No %s object exists with id=%s' % (
                                overlay_type,
                                id)  # entity['id'])
                        )

    def to_native(self, value):
        if value is not None:
            entity_dict = {}
            for e in value.all():
                overlay_type = e.entity_type.name
                if entity_dict.get(overlay_type) is None:
                    entity_dict[overlay_type] = []
                entity_dict[overlay_type].append(e.entity_id)

            entry_list = []
            for key in entity_dict:
                entry_list.append({
                    'overlay_type': key,
                    'entities': entity_dict[key]
                })
            return entry_list


class JSONField(serializers.WritableField):
    type_label = 'json'
    type_name = 'JSONField'

    def from_native(self, data):
        try:
            d = json.loads(data)
            if isinstance(d, dict) or isinstance(d, list):
                return d
            else:
                raise serializers.ValidationError('Error parsing JSON')
        except:
            raise serializers.ValidationError('Error parsing JSON')
        return data

    def to_native(self, value):
        if value is not None:
            if isinstance(value, dict) or isinstance(value, list):
                return value
            value = json.loads(value)
            if isinstance(value, dict) or isinstance(value, list):
                return value
            else:
                raise Exception('Error parsing JSON')
        return None

