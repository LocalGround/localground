#!/usr/bin/env python
from django.forms import ModelForm, fields, formsets, HiddenInput, TextInput, models
from localground.apps.site.widgets import UserAutocomplete
from django.contrib.auth.models import User
from localground.apps.site.models import Project
from django.contrib.contenttypes import generic
from django.conf import settings


class UserAuthorityObjectForm(ModelForm):
    user = models.ModelChoiceField(
        queryset=User.objects.all(),
        widget=UserAutocomplete)
    id = fields.CharField(widget=HiddenInput)

    class Meta:
        from localground.apps.site.models import UserAuthorityObject
        name = 'form'
        model = UserAuthorityObject
        fields = ('id', 'user', 'authority', 'object_id', 'content_type')

    def __init__(self, *args, **kwargs):
        """
        We need access to the county field in the municipality widget, so we
        have to associate the form instance with the widget.
        """
        super(UserAuthorityObjectForm, self).__init__(*args, **kwargs)
        self.fields['user'].widget.form_instance = self
