from localground.apps.lib.helpers import classproperty
from rest_framework import exceptions
import re

class TruthStatement(object):

    def __init__(self, statement, conjunction):
        self.tokens = None
        self.key = None
        self.val = None
        self.operator = None
        self.conjunction = None
        # note: order matters here. Put the <>, <=, !=, and <> before the
        #       <, >, and = in the regex. Also, English words need to be
        #       padded with spaces.
        self.validOperators = ['>=', '<=', '<>', '>', '<', '!=', '=', ' in ',
                ' like ', ' contains ', ' startswith ', ' endswith '
            ]
        self.validConjunctions = ['and', 'or']


        # initialize if user passed in arguments:
        # conjunction = kwargs.get('conjunction')
        # statement = kwargs.get('statement') 
        # print('statement:', statement)
        # print('conjunction:', conjunction)
        if statement is not None and conjunction is not None:
            self.parse_statement(statement, conjunction)

    def parse_statement(self, statement, conjunction):
        if statement == "*":
            self.operator = "*"
            return
        self.set_tokens(statement)
        self.key = self.tokens[0].strip()
        self.set_operator(self.tokens[1].strip())
        self.val = self.tokens[2].strip()
        self.set_conjunction(conjunction)
        self.compile_sql_to_python()

    def set_tokens(self, statement):
        # regex that splits at *first valid operator:
        # TODO: convert to Python regex
        exp = '([\S\s]*?)(' + '|'.join(self.validOperators) + ')([\S\s]*)'
        tokens = re.split(exp, statement)
        tokens.pop(0) # remove top entry
        tokens.pop() # remove bottom entry
        # print(tokens)
        if len(tokens) != 3:
            raise Exception("Statement should parse to three tokens")
        self.tokens = tokens

    def set_operator(self, operator):
        operator = operator.lower().strip()
        #  be sure to account for padding in the validOperator list:
        if operator not in self.validOperators and \
            ' ' + operator + ' ' not in self.validOperators:
                raise Exception("Operator must be one of the following: " +
                    self.validOperators.join(', ')
                )
        self.operator = operator

    def set_conjunction(self, conjunction):
        conjunction = conjunction.lower().strip()
        if conjunction not in self.validConjunctions:
            raise Exception("Conjunction must be 'AND' or 'OR' (case insensitive)")
        self.conjunction = conjunction

    def _trim_character(self, val, character):
        if val[0] == character:
            val = val[1:]
        if val[len(val) - 1] == character:
            val = val[0:len(val) - 1]
        return val

    def trim_single_quotes(self, val):
        return self._trim_character(val, "'")

    def trim_percentages(self, val):
        return self._trim_character(val, "%")

    def trim_parentheses(self, val):
        val = self._trim_character(val, ")")
        return self._trim_character(val, "(")

    def compile_sql_to_python(self):
        i = 0
        endsWith = False
        startsWith = False
        if self.operator == 'in':
            self.val = self.trim_parentheses(self.val)
            self.val = self.val.split(',')
            for i in range(0, len(self.val)):
                self.val[i] = self.trim_single_quotes(self.val[i].strip())
        elif self.operator == 'like':
            self.val = self.trim_single_quotes(self.val)
            startsWith = self.val[len(self.val) - 1] == '%'
            endsWith = self.val[0] == '%'
            self.val = self.trim_percentages(self.val)
            if endsWith and startsWith:
                self.operator = 'contains'
            elif startsWith:
                self.operator = 'startswith'
            else:
                self.operator = 'endswith'
        else:
            self.val = self.trim_single_quotes(self.val)

    def truth_test(self, model_dict):
        if self.operator == '*':
            return True

        if self.val == None:
            self.val = ''

        returnVal = False
        modelVal = model_dict.get(self.key)
        idx = -1

        #  self is necessary to distinguish between a value of '0',
        #  which is a legitimate numerical value, and a value of None or undefined
        try: 
            modelVal
        except NameError: 
            modelVal = None
        if modelVal is None:
            return False

        if isinstance(modelVal, basestring):
            modelVal = modelVal.lower()

        self.val = self.convert_val_to_data_argument_type(modelVal, self.val)


        # print('**************\n', self.key, modelVal, type(modelVal), self.val, '\n**************\n')

        if self.operator == '=':
            returnVal = modelVal == self.val
        elif self.operator == '>':
            returnVal = modelVal > self.val
        elif self.operator == '>=':
            returnVal = modelVal >= self.val
        elif self.operator == '<':
            returnVal = modelVal < self.val
        elif self.operator == '<=':
            returnVal = modelVal <= self.val
        elif self.operator in ['<>', '!=']:
            returnVal = modelVal != self.val
        elif self.operator == 'in':
            returnVal = self.val.find(modelVal) != -1
        elif self.operator == 'contains':
            returnVal = modelVal.find(self.val) != -1
        elif self.operator == 'startswith':
            returnVal = modelVal.find(self.val) == 0
        elif self.operator == 'endswith':
            idx = len(modelVal) - len(self.val)
            returnVal =  modelVal.find(self.val, idx) != -1
        return returnVal

    def get_converter(self, modelVal):
        if isinstance(modelVal, basestring):
            #print('self.parse_string')
            return self.parse_string
        elif isinstance(modelVal, float) or isinstance(modelVal, int):
            #print('self.parse_num')
            return self.parse_num
        elif isinstance(modelVal, bool):
            #print('self.parse_boolean')
            return self.parse_boolean
        else:
            #print('self.dummy')
            def dummy(val):
                return val
            return dummy


    def convert_val_to_data_argument_type(self, modelVal, ruleValue):
        #  self function looks at the record's value, and converts
        #  the rule value to match:
        i = 0
        converter = self.get_converter(modelVal)
        if isinstance(ruleValue, list):
            for i in range(0, len(ruleValue)):
                ruleValue[i] = converter(ruleValue[i])
            return ruleValue
        else:
            return converter(ruleValue)


    def parse_num(self, val):
        return int(val, 10)

    def parse_boolean(self, val):
        if val in ['true', 1, True]:
            return True
        return False

    def parse_string(self, val):
        return str(val).lower()

    def debug(self):
        print("key: ", self.key)
        print("operator: ", self.operator)
        print("value: ", self.val)
        print("conjunction: ", self.conjunction)
        print("tokens: ", self.tokens)


class RuleParser(object):

    def __init__(self, sqlString):
        i = 0
        self.statements = []
        self.sql = None
        self.failureFlag = 0
        self.failureMessage = ''

        self.sql = sqlString.lower().replace("where", "")
        raw_statements = re.split("\s+and\s+|\s+or\s+", self.sql)
        truthStatement = None

        # add an "and" to the top of the stack to make processing consistent:
        raw_statements.insert(0, "and")
        for i in range(0, len(raw_statements)-1):
            raw_statements[i] = raw_statements[i].strip()
            # Fails silently.
            # TODO: have UI check for failureFlag / Message and give
            # user feedback.
            # 
            #try:
            truthStatement = TruthStatement(raw_statements[i + 1], raw_statements[i])
            self.statements.append(truthStatement)
            # truthStatement.debug()
            # except:
            #     self.failureFlag = 1
            #     self.failureMessage = "error parsing truth statement: " +  e


    def check_model(self, model_dict):
        i = 0,
        truthVal = not self.failureFlag
        for i in range(0, len(self.statements)):
            s = self.statements[i]
            # print(s)
            if s.conjunction == 'and':
                truthVal = truthVal and s.truth_test(model_dict)
            else:
                truthVal = truthVal or s.truth_test(model_dict)
        return truthVal


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
        return self._do_substitutions(rule, crosswalk)

    def _deserialize_field_names(self, layer):
        # retrieve lookup table of col_name_db --> col_name:
        crosswalk = self._generate_deserialization_crosswalk(self.rule)
        if not crosswalk:
            return self.rule
        return self._do_substitutions(self.rule, crosswalk)

    def _do_substitutions(self, rule, crosswalk):
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

    def _generate_deserialization_crosswalk(self, rule):
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
        opts.update(self.generate_svg(for_legend=True))
        return opts

    def check_if_match(self, recordModel):
        rule = RuleParser(self.get_rule(None))
        return rule.check_model(recordModel)
    
    def generate_svg(self, for_legend=False):
        '''
        Notes:
         *  viewBox: min-x, min-y, width, height
         *  I've adjusted all of the viewBoxes to have 10px paddings
            to allow for up to a 10px border. This is factored into the 
            width / height calculation

        This code is a little convoluted, and I'm sure could be simplified
        if we had SVG paths of the same sizes.
        '''
        border_padding = 10
        if self.shape == 'circle':
            path = 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z'
            x1, y1, w, h = -1.5, -1.5, 18, 18
        elif self.shape == 'square':
            path = 'M13,14H2c-0.5523,0-1-0.4477-1-1V2c0-0.5523,0.4477-1,1-1h11c0.5523,0,1,0.4477,1,1v11C14,13.5523,13.5523,14,13,14z'
            x1, y1, w, h = -1.5, -1.5, 18, 18
        elif self.shape == 'plus':
            x1, y1, w, h = -250, -250, 1550, 1550
            path = 'M992 384h-352v-352c0-17.672-14.328-32-32-32h-192c-17.672 0-32 14.328-32 32v352h-352c-17.672 0-32 14.328-32 32v192c0 17.672 14.328 32 32 32h352v352c0 17.672 14.328 32 32 32h192c17.672 0 32-14.328 32-32v-352h352c17.672 0 32-14.328 32-32v-192c0-17.672-14.328-32-32-32z'
        elif self.shape == 'cross':
            x1, y1, w, h = -250, -250, 1550, 1550
            path = 'M 1014.66 822.66 c -0.004 -0.004 -0.008 -0.008 -0.012 -0.01 l -310.644 -310.65 l 310.644 -310.65 c 0.004 -0.004 0.008 -0.006 0.012 -0.01 c 3.344 -3.346 5.762 -7.254 7.312 -11.416 c 4.246 -11.376 1.824 -24.682 -7.324 -33.83 l -146.746 -146.746 c -9.148 -9.146 -22.45 -11.566 -33.828 -7.32 c -4.16 1.55 -8.07 3.968 -11.418 7.31 c 0 0.004 -0.004 0.006 -0.008 0.01 l -310.648 310.652 l -310.648 -310.65 c -0.004 -0.004 -0.006 -0.006 -0.01 -0.01 c -3.346 -3.342 -7.254 -5.76 -11.414 -7.31 c -11.38 -4.248 -24.682 -1.826 -33.83 7.32 l -146.748 146.748 c -9.148 9.148 -11.568 22.452 -7.322 33.828 c 1.552 4.16 3.97 8.072 7.312 11.416 c 0.004 0.002 0.006 0.006 0.01 0.01 l 310.65 310.648 l -310.65 310.652 c -0.002 0.004 -0.006 0.006 -0.008 0.01 c -3.342 3.346 -5.76 7.254 -7.314 11.414 c -4.248 11.376 -1.826 24.682 7.322 33.83 l 146.748 146.746 c 9.15 9.148 22.452 11.568 33.83 7.322 c 4.16 -1.552 8.07 -3.97 11.416 -7.312 c 0.002 -0.004 0.006 -0.006 0.01 -0.01 l 310.648 -310.65 l 310.648 310.65 c 0.004 0.002 0.008 0.006 0.012 0.008 c 3.348 3.344 7.254 5.762 11.414 7.314 c 11.378 4.246 24.684 1.826 33.828 -7.322 l 146.746 -146.748 c 9.148 -9.148 11.57 -22.454 7.324 -33.83 c -1.552 -4.16 -3.97 -8.068 -7.314 -11.414 Z'
        else:
            # assume shape is marker:
            x1, y1, w, h = -1, -1, 17.5, 17.5
            path = 'M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297C12.7703,1.4865,9.9324,0,7.5,0z'

        if self.shape in ['circle', 'square', 'plus', 'cross']:
            self.width += border_padding
            self.height += border_padding
            iconSize = [self.width, self.height]
            iconAnchor = [self.width / 2.0, self.height / 2.0]
            popupAnchor = [0, 0]
        else:
            self.height = self.width * 1.35
            self.width += border_padding
            self.height += border_padding
            iconSize = [self.width, self.height]
            iconAnchor = [self.width / 2.0, self.height]
            popupAnchor = [0, -self.height * 0.9]

    
        bbox = '{0} {1} {2} {3}'.format(x1, y1, w, h)
        # print(bbox)

        strokeWeight = self.strokeWeight
        if for_legend:
            strokeWeight = min([strokeWeight, 3])   
        
        svg = '<svg width="{width}" height="{height}" viewBox="{bbox}" xmlns="http://www.w3.org/2000/svg">'
        svg += '<path vector-effect="non-scaling-stroke" stroke="{strokeColor}" stroke-width="{strokeWeight}" fill-opacity="{fillOpacity}" stroke-opacity="{strokeOpacity}" fill="{fillColor}" d="{path}" />'
        svg += '</svg>'
        svg = svg.format(
            width=self.width,
            height=self.height,
            bbox=bbox,
            strokeColor=self.strokeColor,
            strokeWeight=strokeWeight,
            fillOpacity=self.fillOpacity,
            strokeOpacity=self.strokeOpacity,
            fillColor=self.fillColor,
            path=path
        )
        if for_legend:
            return {
                'svg_legend': svg
            }
        return {
            'svg': svg,
            'iconSize': iconSize,
            'iconAnchor': iconAnchor,
            'popupAnchor': popupAnchor,
            'rule': self.get_rule(None),
            'title': self.title,
            'isShowing': self.isShowing
        }

    def to_JSON(self):
        import json
        return json.dumps(self.to_dict())
