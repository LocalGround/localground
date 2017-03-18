from django import template
import json
register = template.Library()

@register.filter
def jsonify(obj):
    if isinstance(obj, dict) or isinstance(obj, list):
        return json.dumps(obj)
    return obj

register.filter('jsonify', jsonify)