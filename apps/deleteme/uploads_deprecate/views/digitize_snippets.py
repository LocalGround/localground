#!/usr/bin/env python
from django.http import HttpResponse
from localground.apps.helpers.api.decorators import process_identity, process_project
from django.shortcuts import render_to_response
from django.template import RequestContext
from localground.apps.uploads.models import Scan, Audio, Photo, Video, StatusCode
from localground.apps.prints.models import Print, Form
from localground.apps.account.models import Project
from django import forms
from django.utils.safestring import mark_safe
import simplejson as json

@process_identity  
def init(request, identity=None, template_name='forms/digitize_snippet_lite.html',
         base_template='base/base.html', embed=False, include_map=False):
    #url:  /scans/update-record/?form_id=35&id=989
    r = request.POST or request.GET
    form_id = r.get('form_id')
    id = r.get('id')
    if form_id is None or id is None:
        return HttpResponse(
            'The following parameters are required to render this form: <br>\
            1) form_id:  a valid form_id <br>\
            2) id: a valid record id')
       
    form = Form.objects.get(id=form_id)
    #DynamicForm = form.get_data_entry_form()
    record = form.TableModel.objects.get(id=id)
    
    context = RequestContext(request)

    if request.POST:
        record_form = form.DataEntryFormClass(request.POST, instance=record)
        if record_form.is_valid():
            
            record_form.save()
            #query for next record
            if r.get('next_record') in ['1', 'true', True]:
                record_new = form.get_next_record(last_id=id)
                if record_new is not None:
                    record = record_new
                    record_form = form.DataEntryFormClass(instance=record)
                    context.update({
                        'success': True,
                        'message': 'The previous data record was successfully \
                                    updated.  You are now viewing the next \
                                     record in the table.'
                    })
                else:
                    context.update({
                        'success': True,
                        'message': 'The data record was successfully updated.  \
                                    There are no more records to edit.',
                        'no_more': True
                    })    
                    
            else:
                context.update({
                    'success': True,
                    'message': 'The data record was successfully updated.'
                })
                
        else:
            context.update({
                'success': False,
                'message': 'There were errors when updating this data record.  \
                                Please review message(s) below.'
            })
    else:
        record_form = form.DataEntryFormClass(instance=record)
    
    context.update({
        'base_template': base_template,
        'embed': embed,
        'form': record_form,
        'record': record,
        'include_map': include_map,
        'form_id': form_id,
        'table_name': form.table_name
    })

    if not include_map:
        return render_to_response(template_name, context)
        
    #add information about source attachment:
    if record.snippet is not None and record.snippet.source_attachment is not None:
        #include source print and source attachment:
        source_attachment = record.snippet.source_attachment
        context.update({
            'source_attachment': json.dumps(source_attachment.to_dict()),
            'source_print': json.dumps(source_attachment.source_print.to_dict())
        })
        
        #include source scan (if it exists):
        if record.scan is not None:
            context.update({
               'source_scan': json.dumps(record.scan.to_dict())
            })
        elif source_attachment.source_scan is not None:
             context.update({
                'source_scan': json.dumps(source_attachment.source_scan.to_dict())
             })
             
        #include source print:
        if source_attachment.source_print:
            context.update({
                'candidate_scans':
                    json.dumps(source_attachment.source_print.get_scans(to_dict=True))
            })
    return render_to_response(template_name, context)
    
    

