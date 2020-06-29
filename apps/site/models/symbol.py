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
            [51, 160, 44],  # green one -- replace
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
        opts = {
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
        opts.update(self.generate_svg())
        return opts
    
    def generate_svg(self):
        iconSize = [self.width, self.height]
        iconAnchor = [self.width / 2.0, self.height / 2.0]
        popupAnchor = [0, 0]
        if self.shape == 'circle':
            self.strokeWeight *= 0.5
            path = 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z'
            bbox = '0.5 0.5 14 14'
        elif self.shape == 'square':
            self.strokeWeight *= 0.5
            path = 'M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z'
            bbox = '0.5 0.5 14 14'
        elif self.shape == 'plus':
            self.strokeWeight *= 25
            bbox = '-130 -130 1200 1200'
            path = 'M992 384h-352v-352c0-17.672-14.328-32-32-32h-192c-17.672 0-32 14.328-32 32v352h-352c-17.672 0-32 14.328-32 32v192c0 17.672 14.328 32 32 32h352v352c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32v-352h352c17.672 0 32-14.328 32-32v-192c0-17.672-14.328-32-32-32z'
        elif self.shape == 'cross':
            self.strokeWeight *= 25
            bbox = '-130 -130 1200 1200'
            path = 'M 1014.66 822.66 c -0.004 -0.004 -0.008 -0.008 -0.012 -0.01 l -310.644 -310.65 l 310.644 -310.65 c 0.004 -0.004 0.008 -0.006 0.012 -0.01 c 3.344 -3.346 5.762 -7.254 7.312 -11.416 c 4.246 -11.376 1.824 -24.682 -7.324 -33.83 l -146.746 -146.746 c -9.148 -9.146 -22.45 -11.566 -33.828 -7.32 c -4.16 1.55 -8.07 3.968 -11.418 7.31 c 0 0.004 -0.004 0.006 -0.008 0.01 l -310.648 310.652 l -310.648 -310.65 c -0.004 -0.004 -0.006 -0.006 -0.01 -0.01 c -3.346 -3.342 -7.254 -5.76 -11.414 -7.31 c -11.38 -4.248 -24.682 -1.826 -33.83 7.32 l -146.748 146.748 c -9.148 9.148 -11.568 22.452 -7.322 33.828 c 1.552 4.16 3.97 8.072 7.312 11.416 c 0.004 0.002 0.006 0.006 0.01 0.01 l 310.65 310.648 l -310.65 310.652 c -0.002 0.004 -0.006 0.006 -0.008 0.01 c -3.342 3.346 -5.76 7.254 -7.314 11.414 c -4.248 11.376 -1.826 24.682 7.322 33.83 l 146.748 146.746 c 9.15 9.148 22.452 11.568 33.83 7.322 c 4.16 -1.552 8.07 -3.97 11.416 -7.312 c 0.002 -0.004 0.006 -0.006 0.01 -0.01 l 310.648 -310.65 l 310.648 310.65 c 0.004 0.002 0.008 0.006 0.012 0.008 c 3.348 3.344 7.254 5.762 11.414 7.314 c 11.378 4.246 24.684 1.826 33.828 -7.322 l 146.746 -146.748 c 9.148 -9.148 11.57 -22.454 7.324 -33.83 c -1.552 -4.16 -3.97 -8.068 -7.314 -11.414 Z'
        else:
            # assume shape is marker:
            iconAnchor = [self.width / 2.0, self.height]
            popupAnchor = [0, -self.height * 0.9]
            self.strokeWeight *= 0.5
            self.height = self.width * 1.2
            path = 'M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z';
            bbox = '1.5 1 12.5 12.5'
        
        svg = '''
            <svg width="{width}" height="{height}" viewBox="{bbox}" xmlns="http://www.w3.org/2000/svg">
                <path stroke="{strokeColor}" 
                    stroke-width="{strokeWeight}" 
                    fill-opacity="{fillOpacity}"
                    stroke-opacity="{strokeOpacity}"
                    fill="{fillColor}" 
                    d="{path}" />
            </svg>'''.format(
                width=self.width,
                height=self.height,
                bbox=bbox,
                strokeColor=self.strokeColor,
                strokeWeight=self.strokeWeight,
                fillOpacity=self.fillOpacity,
                strokeOpacity=self.strokeOpacity,
                fillColor=self.fillColor,
                path=path
            )
        return {
            'svg': svg,
            'iconSize': iconSize,
            'iconAnchor': iconAnchor,
            'popupAnchor': popupAnchor
        }

    def to_JSON(self):
        import json
        return json.dumps(self.to_dict())
