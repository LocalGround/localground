from localground.apps.site.widgets import SnippetWidget, CustomDateTimeWidget
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
            self._data_entry_form_class = self._create_data_entry_form()
        return self._data_entry_form_class
    
    def _create_data_entry_form(self):
        """
        generate a dynamic form from dynamic model that also shows user the
        snippets s/he needs to transcribe:
        """
        form_fields = []
        form_fields.append(self.form.get_num_field())
        form_fields.extend(list(self.form.get_fields()))
        
        field_names = [f.col_name for f in form_fields]
                
        class DynamicForm(forms.ModelForm):
            class Meta:
                from django.forms import widgets
                model = self.form.TableModel
                fields = ('id', 'point') + tuple(field_names)
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
                
                for f in form_fields:
                    form_field = self.form.TableModel._meta.get_field(f.col_name)
                    default_widget_class = get_widget_class(form_field)
                    
                    class SnippetWidget(default_widget_class):
                        def __init__(self, default_widget_class, *args, **kw):
                            super(default_widget_class, self).__init__(*args, **kw)
                            self.default_widget_class = default_widget_class
                            
                        def render(self, name, value, attrs=None):
                            model_obj = self.form_instance.instance
                            if model_obj.get_snippet(name) is not None:
                                img_path = model_obj.get_snippet(name).absolute_virtual_path()
                                html = self.default_widget_class.render(self, name, value, attrs=attrs)
                                html = html + '<img class="snippet" src="%s" />' % img_path
                                return mark_safe(html)
                            else:
                                return self.default_widget_class.render(
                                                self, name, value, attrs=attrs)
                    
                    #add widget to the form:
                    if f.has_snippet_field:
                        widgets[f.col_name] = SnippetWidget(default_widget_class)
            
            
            def __init__(self, *args, **kwargs):
                """
                Overriding the __init__ function to pass the form instance into the
                widget (so that the snippet widget has access to the other form vals)
                """
                super(DynamicForm, self).__init__(*args, **kwargs)
                for n in field_names:
                    self.fields[n].widget.form_instance = self
            
            #override default save method:        
            def save(self, force_insert=False, force_update=False, commit=True):
                model_instance = super(DynamicForm, self).save(commit=False)
                
                '''other updates that need to be made:
                    1) mark reviewed as True
                    2) assign snippet's source attachment to a map scan
                '''
                model_instance.manually_reviewed = True
                attachment = None
                if model_instance.snippet is not None and \
                    model_instance.snippet.source_attachment is not None:
                    attachment = model_instance.snippet.source_attachment
                    #attachment.source_scan = model_instance.scan
                
                if commit:
                    if attachment is not None:
                        attachment.save()
                    model_instance.save()
                return model_instance
        return DynamicForm
   