from localground.apps.site.widgets import CustomDateTimeWidget
from django import forms
from django.forms import widgets
from django.utils.safestring import mark_safe


class DynamicFormBuilder(object):

    def __init__(self, form):
        self.form = form
        self._data_entry_form_class = None

    @property
    def data_entry_form_class(self):
        if self._data_entry_form_class is None:
            self._data_entry_form_class = self._create_data_entry_form(
                self.form)
        return self._data_entry_form_class

    def _create_data_entry_form(self, form):
        """
        generate a dynamic form from dynamic model
        """
        form_fields = []
        form_fields.append(form.get_num_field())
        form_fields.extend(list(form.fields))

        field_names = [f.col_name for f in form_fields]

        class DynamicForm(forms.ModelForm):

            class Meta:
                from django.forms import widgets
                model = self.form.TableModel
                fields = ('id', 'point', 'project') + tuple(field_names)
                widgets = {
                    'id': widgets.HiddenInput,
                    'point': widgets.HiddenInput
                }

                def get_widget_class(model_field):
                    from django.contrib.gis.db import models
                    widget = None
                    if isinstance(model_field, models.CharField):
                        widget = widgets.Textarea
                    elif isinstance(model_field, models.IntegerField):
                        widget = widgets.TextInput
                    elif isinstance(model_field, models.FloatField):
                        widget = widgets.TextInput
                    elif isinstance(model_field, models.DateTimeField):
                        widget = CustomDateTimeWidget
                        #widget = widgets.DateTimeInput
                        #widget = admin_widgets.AdminSplitDateTime
                        #widget = DateTimeWidget
                    elif isinstance(model_field, models.BooleanField):
                        widget = widgets.CheckboxInput
                    else:
                        widget = widgets.TextInput
                    return widget

            def __init__(self, *args, **kwargs):
                super(DynamicForm, self).__init__(*args, **kwargs)
                self.fields["project"].queryset = form.projects.all()

            # override default save method:
            def save(
                    self,
                    force_insert=False,
                    force_update=False,
                    commit=True):
                model_instance = super(DynamicForm, self).save(commit=False)

                '''other updates that need to be made:
                    1) mark reviewed as True
                '''                
                if commit:
                    model_instance.save()
                return model_instance
        return DynamicForm
