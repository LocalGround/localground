#!/usr/bin/env python
from django.forms import ModelForm

def get_media_form(cls):
    class MediaForm(ModelForm):
        class Meta:
            from django import forms
            from localground.apps.site.widgets import PointWidget, PointWidgetHidden, \
                                            TagAutocomplete, CustomDateTimeWidget
            model = cls
            fields = ('id', 'project', 'source_scan', 'name', 'date_created',
                      'description', 'attribution', 'point', 'tags')
            widgets = {
                'id': forms.HiddenInput,
                'point': PointWidgetHidden(), #PointWidget(map_width=300, map_height=200),
                'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
                'source_scan': forms.HiddenInput,
                'date_created': CustomDateTimeWidget,
                'tags': TagAutocomplete()
            }
    return MediaForm
        

def get_inline_media_form(cls):
    class MediaInlineForm(ModelForm):
        class Meta:
            from django import forms
            from localground.apps.site.widgets import \
                                            TagAutocomplete, CustomDateTimeWidget
            model = cls
            fields = ('name', 'description', 'tags', 'attribution', 'date_created')
            widgets = {
                'id': forms.HiddenInput,
                'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
                'date_created': CustomDateTimeWidget,
                'tags': TagAutocomplete()
            }
    return MediaInlineForm

def get_inline_form(cls):
    class InlineForm(ModelForm):
        class Meta:
            from django import forms
            model = cls
            fields = ('name', 'description')
            widgets = {
                'id': forms.HiddenInput,
                'description': forms.Textarea(attrs={'rows': 3})
            }
    return InlineForm