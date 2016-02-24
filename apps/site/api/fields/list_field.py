'''
Extending the DRF's ListField to meet our needs:
https://github.com/tomchristie/django-rest-framework/blob/564b1c8268f70ee5c271f9c1fb89ae50671ee80f/rest_framework/fields.py
'''
from rest_framework import serializers
from rest_framework.fields import empty
from rest_framework.utils import html

def convert_tags_to_list(tags):
    items = []
    for item in tags.split(','):
        item = item.strip()
        if item != "":
            items.append(item)
    return items

class ListField(serializers.ListField):

    def get_value(self, dictionary):
        if self.field_name not in dictionary:
            if getattr(self.root, 'partial', False):
                return empty
        # We override the default field access in order to support
        # lists in HTML forms.
        #if html.is_html_input(dictionary):
        val = dictionary.get(self.field_name, None)
        if val == None:
            return empty
        if isinstance(val, basestring):
            # return html.parse_html_list(dictionary, prefix=self.field_name)
            val = convert_tags_to_list(val)   
        return val
