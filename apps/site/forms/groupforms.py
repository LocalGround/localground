#!/usr/bin/env python
from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm, fields, formsets, widgets, HiddenInput, models
from localground.apps.site.widgets import UserAutocomplete
from localground.apps.site.models import Project, Snapshot, Form
from django.conf import settings

class ProjectPermissionsForm(ModelForm):

    class Meta:
        model = Project
        fields = ('access_authority', 'access_key', 'owner', 'slug')
        widgets = {
            'owner': UserAutocomplete()
        }

    def __init__(self, *args, **kwargs):
        """
        We need access to the user field in the UserAutocomplete widget, so we
        have to associate the form instance with the widget.
        """
        super(ProjectPermissionsForm, self).__init__(*args, **kwargs)
        self.fields['owner'].widget.form_instance = self

    class Media:
        js = (
            '/%s/scripts/thirdparty/jquery.formset.js' %
            settings.STATIC_MEDIA_DIR,
            '/%s/scripts/site/account/createupdategroup.js' %
            settings.STATIC_MEDIA_DIR)


class ProjectCreateForm(ModelForm):

    class Meta:
        from localground.apps.site.widgets import ArrayFieldTagWidget
        model = Project
        fields = (
            'name',
            'description',
            'tags',
            'access_authority',
            'access_key',
            'slug')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3, 'cols': 160}),
            'tags': ArrayFieldTagWidget(attrs={'delimiter': ','})
        }

    class Media:
        js = (
            '/%s/scripts/thirdparty/jquery.formset.js' %
            settings.STATIC_MEDIA_DIR,
            '/%s/scripts/site/account/createupdategroup.js' %
            settings.STATIC_MEDIA_DIR)


class ProjectInlineUpdateForm(ModelForm):

    class Meta:
        model = Project
        fields = ('name', 'description', 'slug', 'tags')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 1, 'cols': 160})
        }

    def __init__(self, *args, **kwargs):
        """
        We need access to the user field in the UserAutocomplete widget, so we
        have to associate the form instance with the widget.
        """
        super(ProjectInlineUpdateForm, self).__init__(*args, **kwargs)


class ProjectUpdateForm(ModelForm):

    class Meta:
        model = Project
        fields = (
            'name',
            'description',
            'access_authority',
            'access_key',
            'slug',
            'owner')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4, 'cols': 160}),
            'owner': UserAutocomplete()
        }

    def __init__(self, *args, **kwargs):
        """
        We need access to the user field in the UserAutocomplete widget, so we
        have to associate the form instance with the widget.
        """
        super(ProjectUpdateForm, self).__init__(*args, **kwargs)
        self.fields['owner'].widget.form_instance = self

    class Media:
        js = (
            '/%s/scripts/thirdparty/jquery.formset.js' %
            settings.STATIC_MEDIA_DIR,
            '/%s/scripts/site/account/createupdategroup.js' %
            settings.STATIC_MEDIA_DIR)


class SnapshotPermissionsForm(ProjectPermissionsForm):

    class Meta(ProjectPermissionsForm.Meta):
        model = Snapshot


class SnapshotCreateForm(ProjectCreateForm):

    class Meta(ProjectCreateForm.Meta):
        model = Snapshot


class SnapshotInlineUpdateForm(ProjectInlineUpdateForm):

    class Meta(ProjectInlineUpdateForm.Meta):
        model = Snapshot


class SnapshotUpdateForm(ProjectUpdateForm):

    class Meta(ProjectUpdateForm.Meta):
        model = Snapshot


class FormPermissionsForm(ProjectPermissionsForm):

    class Meta(ProjectPermissionsForm.Meta):
        model = Form


class FormInlineUpdateForm(ProjectInlineUpdateForm):

    class Meta(ProjectInlineUpdateForm.Meta):
        model = Form


class FormCreateForm(ProjectCreateForm):

    class Meta(ProjectCreateForm.Meta):
        model = Form


class FormUpdateForm(ProjectUpdateForm):

    class Meta(ProjectUpdateForm.Meta):
        model = Form
