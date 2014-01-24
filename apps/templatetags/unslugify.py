from django.template.defaultfilters import stringfilter
from django import template

register = template.Library()

@register.filter
@stringfilter
def unslugify(value):
	val = value.replace('_', ' ')
	return value.replace('-', ' ')
