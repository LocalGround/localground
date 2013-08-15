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
def update_form_fields(request, object_id=None,
						  embed=False, template='profile/create_update_form.html',
						  base_template='base/base.html'):
	
	from localground.apps.site.models import Form, Field
	from django.forms import models, formsets, ModelForm
	from django.http import HttpResponseRedirect
	from django.shortcuts import render_to_response
	from django.template import RequestContext
	r = request.POST or request.GET
	
	class FieldForm(ModelForm):
		class Meta:
			model = Field
			fields = ('col_alias', 'data_type', 'is_display_field', 'is_printable')
	
	from django.forms.models import inlineformset_factory
	
	form_object = Form.objects.get(id=object_id)
	fields = form_object.get_fields()
	extra = 0
	if len(fields) == 0: extra = 1
	if embed: base_template = 'base/iframe.html'
	FieldFormset = inlineformset_factory(Form, Field, FieldForm, extra=extra, max_num=100)
	
	prefix = 'field'
	
	extras = {}
	if request.method == 'POST':
		from localground.apps.lib.helpers import get_timestamp_no_milliseconds
		
		form = form_object.inline_form()(request.POST, instance=form_object)
		formset = FieldFormset(request.POST, instance=form_object, prefix=prefix)
		
		if formset.is_valid() and form.is_valid():
			form_object = form.instance
			form_object.time_stamp = get_timestamp_no_milliseconds()
			
			if form_object.pk is None:
				form_object.owner = request.user
				form_object.date_created = get_timestamp_no_milliseconds()
				is_new = True
			
			form_object.last_updated_by = request.user
			form_object.save(user=request.user)
			# -----------------------------------
			# PROJECTUSER FORM(S) POST-PROCESSING
			# -----------------------------------
			marked_for_delete = formset.deleted_forms
			for i, form in enumerate(formset.forms):
				if form.has_changed():
					instance = form.instance
					if not instance in formset.deleted_forms:
						instance.display_width = 10
						instance.ordering = i
						instance.save(user=request.user)
			if len(marked_for_delete) > 0:
				formset.save()
				
			#syncdb
			form_object.sync_db()
			
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
		form = form_object.inline_form()(instance=form_object)
		formset = FieldFormset(instance=form_object, prefix=prefix)
	
	extras.update({
		'form': form,
		'formset': formset,
		'prefix': prefix,
		'group_object': form_object,
		'object_name': form_object.model_name,
		'parent_id': form_object.id,
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
	