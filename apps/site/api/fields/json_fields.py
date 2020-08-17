from rest_framework import serializers
import json
from localground.apps.site.models import Symbol


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
        GenericRelations must be done in the view itself
        b/c it needs access to the saved instance.
        '''
        import json
        if value:
            try:
                entities = json.loads(value)
            except Exception:
                raise serializers.ValidationError('Error parsing JSON')

            for child in entities:
                try:
                    overlay_type = child['overlay_type']
                    ids = child['ids']
                except Exception:
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
                    except Exception:
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
        if isinstance(data, dict) or isinstance(data, list):
            return data
        if isinstance(data, str) and len(data) == 0:
            return None
        try:
            d = json.loads(data)
            if isinstance(d, dict) or isinstance(d, list):
                return d
            else:
                raise serializers.ValidationError('Error parsing JSON')
        except Exception:
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


class SymbolsField(JSONField):
    type_label = 'json'
    type_name = 'JSONField'

    def to_internal_value(self, symbols):
        symbols = super(SymbolsField, self).to_internal_value(symbols)
        if self.root.instance and symbols:
            for i, symbol_dict in enumerate(symbols):
                s = Symbol(**symbol_dict)
                s.set_rule(symbol_dict['rule'], self.root.instance)
                symbols[i] = s.to_dict()
        return symbols

    def get_attribute(self, obj):
        # We pass the object instance onto `to_representation`,
        # not just the field attribute.
        return obj

    def to_representation(self, layerModel):
        for i, symbol_dict in enumerate(layerModel.symbols):
            s = Symbol(layer=layerModel, **symbol_dict)
            layerModel.symbols[i] = s.to_dict()
            layerModel.symbols[i]['rule'] = s.get_rule(layerModel)
        return layerModel.symbols
