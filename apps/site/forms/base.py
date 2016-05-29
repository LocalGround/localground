#!/usr/bin/env python
from django.forms import ModelForm


def get_media_form(cls, user):
    class MediaForm(ModelForm):

        def __init__(self, *args, **kwargs):
            super(MediaInlineForm, self).__init__(*args, **kwargs)
            from localground.apps.site import models
            self.fields[
                "project"].queryset = models.Project.objects.get_objects(user)

        class Meta:
            from django import forms
            from localground.apps.site.widgets import PointWidget, PointWidgetHidden, \
            ArrayFieldTagWidget, CustomDateTimeWidget
            model = cls
            fields = ('id', 'project', 'source_mapimage', 'name', 'date_created',
                      'description', 'attribution', 'point', 'tags')
            widgets = {
                'id': forms.HiddenInput,
                # PointWidget(map_width=300, map_height=200),
                'point': PointWidgetHidden(),
                # any valid html attributes as attrs
                'description': forms.Textarea(attrs={'rows': 3}),
                'source_mapimage': forms.HiddenInput,
                'date_created': CustomDateTimeWidget,
                'tags': ArrayFieldTagWidget(attrs={'delimiter': ','})
            }
    return MediaForm


def get_inline_media_form(cls, user):
    class MediaInlineForm(ModelForm):

        def __init__(self, *args, **kwargs):
            super(MediaInlineForm, self).__init__(*args, **kwargs)
            from localground.apps.site import models
            self.fields[
                "project"].queryset = models.Project.objects.get_objects(user)

        class Meta:
            from django import forms
            from localground.apps.site.widgets import ArrayFieldTagWidget, CustomDateTimeWidget
            model = cls
            fields = (
                'name',
                'description',
                'tags',
                'project',
                'attribution',
                'date_created')
            widgets = {
                'id': forms.HiddenInput,
                # any valid html attributes as attrs
                'description': forms.Textarea(attrs={'rows': 3}),
                'date_created': CustomDateTimeWidget,
                'tags': ArrayFieldTagWidget(attrs={'delimiter': ','})
            }
    return MediaInlineForm


def get_inline_form(cls, user):
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


def get_inline_form_with_tags(cls, user):

    class InlineForm(ModelForm):

        def __init__(self, *args, **kwargs):
            super(InlineForm, self).__init__(*args, **kwargs)
            from localground.apps.site import models
            from localground.apps.site.widgets import ArrayFieldTagWidget
            self.fields[
                "project"].queryset = models.Project.objects.get_objects(user)

        class Meta:
            from django import forms
            from localground.apps.site.widgets import ArrayFieldTagWidget
            model = cls
            fields = ('name', 'description', 'tags', 'project')
            widgets = {
                'id': forms.HiddenInput,
                'description': forms.Textarea(attrs={'rows': 3}),
                'tags': ArrayFieldTagWidget(attrs={'delimiter': ','})
            }
    return InlineForm
