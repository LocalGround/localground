from django import template
import json
register = template.Library()

@register.filter
def jsonify(dictionary):
    if isinstance(dictionary, dict):
        return json.dumps(dictionary)
    return dictionary

register.filter('jsonify', jsonify)