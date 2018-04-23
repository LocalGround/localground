from localground.apps.lib.helpers import classproperty


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

    def to_dict(self):
        return {
            'rule': '*',
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
