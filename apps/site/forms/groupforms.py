#!/usr/bin/env python
from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm, fields, formsets, widgets, HiddenInput, models
from localground.apps.site.widgets import UserAutocomplete
from localground.apps.site.models import Project, View
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
        js = ('http://ajax.aspnetcdn.com/ajax/jquery.ui/1.8.8/jquery-ui.min.js',
              '/%s/scripts/thirdparty/jquery.formset.js' % settings.STATIC_MEDIA_DIR,
              '/%s/scripts/site/account/createupdategroup.js' % settings.STATIC_MEDIA_DIR
             )
        css = {
            'all': ('/%s/css/themes/bootstrap/jquery-ui-1.8.16.custom.css' % settings.STATIC_MEDIA_DIR,)
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
              '/%s/scripts/thirdparty/jquery.formset.js' % settings.STATIC_MEDIA_DIR,
              '/%s/scripts/site/account/createupdategroup.js' % settings.STATIC_MEDIA_DIR
             )
        css = {
            'all': ('/%s/css/themes/bootstrap/jquery-ui-1.8.16.custom.css' % settings.STATIC_MEDIA_DIR,)
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
              '/%s/scripts/thirdparty/jquery.formset.js' % settings.STATIC_MEDIA_DIR,
              '/%s/scripts/site/account/createupdategroup.js' % settings.STATIC_MEDIA_DIR
             )
        css = {
            'all': ('/%s/css/themes/bootstrap/jquery-ui-1.8.16.custom.css' % settings.STATIC_MEDIA_DIR,)
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

        