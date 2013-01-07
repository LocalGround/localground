from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm
from localground.apps.site.models import UserProfile

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        fields = ('username', 'first_name', 'last_name', 'email') #respects ordering  
        
class UserProfileForm(ModelForm):
    class Meta:
        from localground.apps.helpers.widgets import PointWidget, CustomCheckboxSelectMultiple
        from django import forms
        
        model = UserProfile
        fields = ('email_announcements', 'default_view_authority', 'contacts', 'default_location')
        widgets = {
            'default_location': PointWidget(map_width=300, map_height=200),
            'contacts': CustomCheckboxSelectMultiple(
                autocomplete_url='/profile/get-contacts/',
                opts_url='/api/0/get-users-from-string/')
        }