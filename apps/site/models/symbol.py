from localground.apps.lib.helpers import classproperty
from rest_framework import exceptions
import re


class Symbol(object):

    @classproperty
    def SIMPLE(cls):
        return Symbol()
    CIRCLE = 'circle'

    def get_random_color(self):
        # Taken from:
        # http://colorbrewer2.org/#type=qualitative&scheme=Paired&n=12
        colors = [
            # r, g, b:
            [166, 206, 227],
            [31, 120, 180],
            [178, 223, 138],
            [51, 160, 44],
            [251, 154, 153],
            [227, 26, 28],
            [253, 191, 111],
            [255, 127, 0],
            [202, 178, 214],
            [106, 61, 154],
            [255, 255, 153],
            [177, 89, 40]
        ]
        from random import randint
        return 'rgb({0}, {1}, {2})'.format(*colors[randint(0, len(colors)-1)])

    def get_random_color_programatic(self):
        # See Stack Overflow post:
        # https://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
        from random import randint
        hue = 100  # blue-purple color
        r = (randint(0, 255) + hue) / 2
        g = (randint(0, 255) + hue) / 2
        b = (randint(0, 255) + hue) / 2
        random_color = 'rgb({0}, {1}, {2})'.format(r, g, b)
        print random_color
        return random_color

    def __init__(self, **kwargs):
        self.rule = kwargs.get('rule', '*')
        self.title = kwargs.get('title', 'Untitled Symbol')
        self.shape = kwargs.get('shape', Symbol.CIRCLE)
        self.fillOpacity = kwargs.get('fillOpacity', 1)
        self.strokeWeight = kwargs.get('strokeWeight', 1)
        self.strokeOpacity = kwargs.get('strokeOpacity', 1)
        self.strokeColor = kwargs.get('strokeColor', '#ffffff')
        self.width = kwargs.get('width', 25)
        self.height = kwargs.get('height', 25)
        self.isShowing = kwargs.get('isShowing', True)
        self.fillColor = kwargs.get('fillColor', self.get_random_color())

    def set_rule(self, rule, layer):
        rule = rule.lower()
        if rule == '*' or rule == u'\xaf\\_(\u30c4)_/\xaf':
            self.rule = rule
            return
        server_rule = self._serialize_field_names(rule, layer)
        self.rule = server_rule

    def get_rule(self, layer):
        if self.rule == '*' or self.rule == u'\xaf\\_(\u30c4)_/\xaf':
            return self.rule
        return self._deserialize_field_names(layer)

    def _get_expressions(self, rule):
        expressions = [n.strip() for n in re.split('(\s+or|and\s+)', rule)]
        print expressions
        print ' '.join(expressions)
        return filter(lambda e: e != 'or' and e != 'and', expressions)

    def _serialize_field_names(self, rule, layer):
        # retrieve lookup table of col_name --> col_name_db:
        crosswalk = self._generate_serialization_crosswalk(rule, layer)
        return self._do_substitutions(rule, layer, crosswalk)

    def _deserialize_field_names(self, layer):
        # retrieve lookup table of col_name_db --> col_name:
        crosswalk = self._generate_deserialization_crosswalk(self.rule, layer)
        return self._do_substitutions(self.rule, layer, crosswalk)

    def _do_substitutions(self, rule, layer, crosswalk):
        # normalize expressions:
        expressions = [n.strip() for n in re.split('(\s+or|and\s+)', rule)]

        # tokenize each expression (split on spaces)
        expression_token_list = [re.split('\s+', e) for e in expressions]

        # iterate through tokens and replace the first token in each list
        # (the column name) with col_name_db for relevant token sets:
        for i, tokens in enumerate(expression_token_list):
            if tokens[0] not in ['and', 'or']:
                tokens[0] = crosswalk[tokens[0]]
            expressions[i] = ' '.join(tokens)

        # return the serialized rule:
        return ' '.join(expressions)

    def _generate_serialization_crosswalk(self, rule, layer):
        expressions = self._get_expressions(rule)
        crosswalk = {}
        col_names = list(set([re.split('\s+', e)[0] for e in expressions]))
        invalid_field_names = []
        for col_name in col_names:
            match = False
            for field in layer.dataset.fields:
                if field.col_name == col_name:
                    crosswalk[col_name] = field.col_name_db
                    break
            if not crosswalk.get(col_name):
                raise exceptions.ValidationError(
                    'Symbol rule "{0}" is not valid.'.format(rule))
        return crosswalk

    def _generate_deserialization_crosswalk(self, rule, layer):
        from localground.apps.site.models import Field
        expressions = self._get_expressions(rule)
        crosswalk = {}
        col_name_db_list = [re.split('\s+', e)[0] for e in expressions]
        fields = Field.objects.filter(col_name_db__in=col_name_db_list)
        crosswalk = {}
        for field in fields:
            crosswalk[field.col_name_db] = field.col_name
        return crosswalk

    def to_dict(self):
        return {
            'rule': self.rule,
            'title': self.title,
            'shape': self.shape,
            'fillOpacity': self.fillOpacity,
            'strokeWeight': self.strokeWeight,
            'strokeOpacity': self.strokeOpacity,
            'strokeColor': self.strokeColor,
            'width': self.width,
            'height': self.height,
            'isShowing': self.isShowing,
            'fillColor': self.fillColor
        }

    def to_JSON(self):
        import json
        return json.dumps(self.to_dict())
