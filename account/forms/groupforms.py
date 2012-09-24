#!/usr/bin/env python
from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm, fields, formsets, widgets, HiddenInput, models
from localground.lib.widgets import UserAutocomplete
from localground.account.models import Project, View

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
        js = ('http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.8/jquery-ui.min.js',
              '/site_media/scripts/third_party/jquery.formset.js',
              '/site_media/scripts/site/account/createupdategroup.js'
             )
        css = {
            'all': ('/site_media/css/themes/bootstrap/jquery-ui-1.8.16.custom.css',)
        }
        
class ProjectCreateForm(ModelForm):
    class Meta:
        model = Project
        fields = ('name', 'description','access_authority', 'access_key', 'slug')
        widgets = {
            'description': forms.Textarea(attrs={'rows':4, 'cols':160})
        }
    
    class Media:
        js = ('http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.8/jquery-ui.min.js',
              '/site_media/scripts/third_party/jquery.formset.js',
              '/site_media/scripts/site/account/createupdategroup.js'
             )
        css = {
            'all': ('/site_media/css/themes/bootstrap/jquery-ui-1.8.16.custom.css',)
        }
        
class ProjectUpdateForm(ModelForm):
    class Meta:
        model = Project
        fields = ('name', 'description','access_authority', 'access_key', 'slug', 'owner')
        widgets = {
            'description': forms.Textarea(attrs={'rows':4, 'cols':160}),
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
        js = ('http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.8/jquery-ui.min.js',
              '/site_media/scripts/third_party/jquery.formset.js',
              '/site_media/scripts/site/account/createupdategroup.js'
             )
        css = {
            'all': ('/site_media/css/themes/bootstrap/jquery-ui-1.8.16.custom.css',)
        }

 
class ViewPermissionsForm(ProjectPermissionsForm):
    class Meta(ProjectPermissionsForm.Meta):
        model = View
        
class ViewCreateForm(ProjectCreateForm):
    class Meta(ProjectCreateForm.Meta):
        model = View
      
class ViewUpdateForm(ProjectUpdateForm):
    class Meta(ProjectUpdateForm.Meta):
        model = View

        