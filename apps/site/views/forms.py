from localground.apps.site.decorators import process_identity
from django.http import HttpResponse
import simplejson as json
from django.contrib.auth.decorators import login_required

@login_required()
def create_update_form(request, object_id=None,
                       embed=False, template='profile/create_update_form.html',
                       base_template='base/profile.html'):

    from localground.apps.site.models import Form, Field
    from django.forms import models, formsets, ModelForm
    from django.http import HttpResponseRedirect
    from django.shortcuts import render_to_response
    from django.template import RequestContext
    r = request.POST or request.GET
    extras = {}

    if (r.get('success', 'false') in ['1', 'true', 'True']):
        extras.update({
            'success': True,
            'message': 'The %s information was successfully saved.' % Form.model_name
        })

    class FieldForm(ModelForm):

        class Meta:
            model = Field
            fields = (
                'col_alias',
                'data_type',
                'is_display_field',
                'ordering')
            
        def __init__(self, *args, **kwargs):
            super(FieldForm, self).__init__(*args, **kwargs)
            self.fields['is_display_field'].widget.attrs.update({
                'class': 'is_display_field'
            })

    from django.forms.models import inlineformset_factory

    form_object, fields = None, []
    if object_id is not None:
        form_object = Form.objects.get(id=object_id)
        fields = form_object.fields
    extra = 0
    if len(fields) == 0:
        extra = 1
    if embed:
        base_template = 'base/iframe.html'
    FieldFormset = inlineformset_factory(
        Form,
        Field,
        FieldForm,
        extra=extra,
        max_num=100)

    prefix = 'field'

    if request.method == 'POST':
        form = Form.create_form(
            user=request.user)(
            request.POST,
            instance=form_object)
        formset = FieldFormset(
            request.POST,
            instance=form_object,
            prefix=prefix)

        if formset.is_valid() and form.is_valid():
            form_object = form.instance
            form_object.save(user=request.user)

            # saved authorized projects:
            form_object.projects.clear()
            for p in request.POST.getlist('projects'):
                form_object.projects.add(p)
            form_object.save()

            # ------------------------
            # FIELD(S) POST-PROCESSING
            # ------------------------

            # add / update fields:
            for i, form in enumerate(formset.forms):
                if form.has_changed():
                    instance = form.instance
                    if not instance in formset.deleted_forms:
                        if instance.pk is None:
                            instance.form = form_object
                        instance.last_updated_by = request.user
                        if instance.pk is None:
                            instance.owner = request.user
                        instance.save()

            # remove unwanted fields here:
            for form in formset.deleted_forms:
                form.instance.delete()

            form_object.remove_table_from_cache()

            url = '/profile/forms/%s/' % form_object.id
            if embed:
                url += 'embed/'
            url += '?success=true'
            return HttpResponseRedirect(url)
        else:
            extras.update({
                'success': False,
                'error_message': 'There were errors when updating the %s information.  \
                    Please review message(s) below.' % Field.model_name
            })
    else:
        form = Form.create_form(user=request.user)(instance=form_object)
        formset = FieldFormset(instance=form_object, prefix=prefix)

    extras.update({
        'form': form,
        'formset': formset,
        'prefix': prefix,
        'object_name': Form.model_name,
        'show_hidden_fields': True,
        'base_template': base_template,
        'embed': embed,
        'no_fields': len(fields) == 0
    })
    if form_object:
        extras.update({
            'owner': form_object.owner.username
        })
    return render_to_response(template, extras,
                              context_instance=RequestContext(request))

