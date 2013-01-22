#!/usr/bin/env python
#!/usr/bin/env python
from django.contrib.auth.forms import UserChangeForm
from django.forms import ModelForm
from localground.apps.site.models import Photo

class PhotoForm(ModelForm):
    class Meta:
        from django import forms
        from localground.apps.site.widgets import PointWidget, PointWidgetHidden, \
                                        TagAutocomplete, CustomDateTimeWidget
        model = Photo
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
        
class PhotoInlineForm(ModelForm):
    class Meta:
        from django import forms
        from localground.apps.site.widgets import \
                                        TagAutocomplete, CustomDateTimeWidget
        model = Photo
        fields = ('name', 'description', 'tags', 'attribution', 'date_created')
        widgets = {
            'id': forms.HiddenInput,
            'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
            'date_created': CustomDateTimeWidget,
            'tags': TagAutocomplete()
        }

