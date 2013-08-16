from localground.apps.site.decorators import process_identity
from django.http import HttpResponse
import simplejson as json
from django.contrib.auth.decorators import login_required 

@process_identity
def get_datatypes(request, identity=None):
	from localground.apps.site.models import DataType
	types = DataType.objects.all().order_by('name')
	return HttpResponse(json.dumps(dict(
		types=[t.to_dict() for t in types]    
	)))
	

@process_identity
def create_form(request, identity=None, is_json=False):
	from django.db import connection, transaction
	r = request.POST or request.GET
	form = Form.create_new_form(r)
	
	return HttpResponse(json.dumps(dict(
		form=form.to_dict()
	)))

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
			fields = ('col_alias', 'data_type', 'is_display_field', 'is_printable')
	
	from django.forms.models import inlineformset_factory
	
	form_object, fields = None, []
	if object_id is not None:
		form_object = Form.objects.get(id=object_id)
		fields = form_object.get_fields()
	extra = 0
	if len(fields) == 0: extra = 1
	if embed: base_template = 'base/iframe.html'
	FieldFormset = inlineformset_factory(Form, Field, FieldForm, extra=extra, max_num=100)
	
	prefix = 'field'
	
	if request.method == 'POST':
		form = Form.inline_form(user=request.user)(request.POST, instance=form_object)
		formset = FieldFormset(request.POST, instance=form_object, prefix=prefix)
		
		if formset.is_valid() and form.is_valid():
			form_object = form.instance
			form_object.save(user=request.user)
			
			# -----------------------------------
			# PROJECTUSER FORM(S) POST-PROCESSING
			# -----------------------------------
			
			# add / update fields:
			for i, form in enumerate(formset.forms):
				if form.has_changed():
					instance = form.instance
					if not instance in formset.deleted_forms:
						instance.display_width = 10
						instance.ordering = i
						if instance.pk is None:
							instance.form = form_object
						instance.save(user=request.user)
			
			# remove unwanted fields here:
			for form in formset.deleted_forms:
				form.instance.delete()
			
			url = '/profile/forms/%s/' % form_object.id
			if embed:
				url += 'embed/'
			url += '?success=true'
			return HttpResponseRedirect(url)
		else:
			extras.update({
				'success': False,
				'error_message': 'There were errors when updating the %s information.  \
								Please review message(s) below.' %  Field.model_name
			})
	else:
		form = Form.inline_form(user=request.user)(instance=form_object)
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
	