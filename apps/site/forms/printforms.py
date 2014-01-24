#!/usr/bin/env python
from django import forms
from localground.apps.site.models import FieldLayout

class FieldLayoutForm(forms.ModelForm):
	class Meta:
		name = 'form'
		model = FieldLayout
		fields = ('id', 'map_print', 'field', 'width', 'ordering')
		widgets = {
			'field': forms.TextInput(),
		}