from localground.apps.lib.helpers import classproperty
from rest_framework import exceptions
import re


class Symbol(object):

    @classproperty
    def SIMPLE(cls):
        return Symbol(title='All items')
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

    def _split_by_conjunction(self, rule):
        # extra logic to ensure that phrases surrounded by quotes that have
        # 'and' or 'or' in them (e.g. Kai and Leyna) don't get split
        # incorrectly
        expressions = []
        start = end = 0
        regex = "( |\\\".*?\\\"|'.*?')"
        for token in [token for token in re.split(regex, rule) if token]:
            for delimiter in ['and', 'or']:
                if token == delimiter:
                    expressions.append(rule[start:end].strip())
                    start = end + len(delimiter)
                    expressions.append(rule[end:start].strip())
            end += len(token)
        expressions.append(rule[start:end].strip())
        return expressions

    def _get_expressions(self, rule):
        expressions = self._split_by_conjunction(rule)
        return filter(lambda e: e != 'or' and e != 'and', expressions)

    def _serialize_field_names(self, rule, layer):
        # retrieve lookup table of col_name --> col_name_db:
        crosswalk = self._generate_serialization_crosswalk(rule, layer)
        return self._do_substitutions(rule, layer, crosswalk)

    def _deserialize_field_names(self, layer):
        # retrieve lookup table of col_name_db --> col_name:
        crosswalk = self._generate_deserialization_crosswalk(self.rule, layer)
        if not crosswalk:
            return self.rule
        return self._do_substitutions(self.rule, layer, crosswalk)

    def _do_substitutions(self, rule, layer, crosswalk):
        expressions = self._split_by_conjunction(rule)
        # tokenize and validate each expression (split on spaces)
        for i, e in enumerate(expressions):
            tokens = re.split('("[^"]*"|\'[^\']*\'|[\S]+)+', e)
            tokens = filter(
                lambda x: x != '' and x != ' ', tokens)
            if tokens[0] not in ['and', 'or']:
                if len(tokens) != 3:
                    raise exceptions.ValidationError(
                        'Symbol rule "{0}" is not valid.'.format(rule))
                tokens[0] = crosswalk[tokens[0]]
            expressions[i] = ' '.join(tokens)

        # return the serialized rule:
        return ' '.join(expressions)

    def _generate_serialization_crosswalk(self, rule, layer):
        expressions = self._get_expressions(rule)
        crosswalk = {'id': 'id'}
        col_names = list(set([re.split('\s+', e)[0] for e in expressions]))
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
