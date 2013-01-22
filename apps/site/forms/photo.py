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
        fields = ('id', 'project', 'source_scan', 'name', 'created_timestamp',
                  'description', 'attribution', 'point', 'tags')
        widgets = {
            'id': forms.HiddenInput,
            'point': PointWidgetHidden(), #PointWidget(map_width=300, map_height=200),
            'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
            'source_scan': forms.HiddenInput,
            'created_timestamp': CustomDateTimeWidget,
            'tags': TagAutocomplete()
        }
        
class PhotoInlineForm(ModelForm):
    class Meta:
        from django import forms
        from localground.apps.site.widgets import \
                                        TagAutocomplete, CustomDateTimeWidget
        model = Photo
        fields = ('name', 'description', 'tags', 'attribution', 'created_timestamp')
        widgets = {
            'id': forms.HiddenInput,
            'description': forms.Textarea(attrs={'rows': 3}), #any valid html attributes as attrs
            'created_timestamp': CustomDateTimeWidget,
            'tags': TagAutocomplete()
        }

