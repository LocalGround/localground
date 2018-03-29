from localground.apps.lib.helpers import classproperty


class Symbol(object):

    @classproperty
    def SIMPLE(cls):
        return Symbol()
    CIRCLE = 'circle'

    def __init__(self, **kwargs):
        self.rule = kwargs.get('rule', '*')
        self.title = kwargs.get('title', 'Untitled Layer')
        self.shape = kwargs.get('shape', Symbol.CIRCLE)
        self.fillOpacity = kwargs.get('fillOpacity', 1)
        self.strokeWeight = kwargs.get('strokeWeight', 1)
        self.strokeOpacity = kwargs.get('strokeOpacity', 1)
        self.strokeColor = kwargs.get('strokeColor', '#ffffff')
        self.width = kwargs.get('width', 20)
        self.height = kwargs.get('height', 20)
        self.isShowing = kwargs.get('isShowing', True)
        self.fillColor = kwargs.get('fillColor', '#4e70d4')

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
