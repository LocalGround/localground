from localground.apps.lib.helpers.generic import prep_paginator
from django.http import HttpResponse
from localground.apps.site.decorators import process_identity, process_project
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from localground.apps.site.models import (Scan, Attachment, Audio, Photo, Video,
        StatusCode, Print, Form, Project)
import simplejson as json
from django.conf import settings
import os
    
@login_required()
def get_objects(request, object_id, format_type='table'):
    context = RequestContext(request)
    r = request.GET or request.POST
    object_type = 'tables'
    template_name = 'profile/form_data.html'
    is_blank = r.get('is_blank', False) in ['1', 'True', 'true']
    project, project_id = None, None
    if r.get('project_id'):
        project_id = r.get('project_id')
        project = Project.objects.get(id=project_id)
    
    forms = Form.objects.my_forms(user=request.user)
    form = Form.objects.get(id=object_id)
    records = []
    attachment = None
    if r.get('attachment_id') is not None:
        try:
            attachment = Attachment.objects.get(id=int(r.get('attachment_id')))
        except Attachment.DoesNotExist:
            pass
    records = form.get_data(project=project,
                                is_blank=is_blank, has_geometry=False,
                                attachment=attachment)

    raw_url = '/profile/forms/%s/data/' % object_id
    suffix = '?is_blank=%s&format_type=%s' % (is_blank, format_type)
    context.update({
        'username': request.user.username,
        'suffix': suffix,
        'raw_url': raw_url,
        'url': '%s%s' % (raw_url, suffix),
        'create_url': '%screate/embed/' % raw_url, 
        'delete_url': '%sdelete/batch/embed/' % raw_url, 
        'form': form,
        'forms': list(forms),
        'selected_project': project,
        'selected_project_id': project_id,
        'object_type': 'record',
        'object_name_plural': '%s records' % form.name,
        'format_type': format_type,
        'is_blank': is_blank,
        'style': r.get('style',
                    request.COOKIES.get('style_' + request.user.username, 'default'))
    })
    if request.user.is_superuser:
        context.update({'users': Project.get_users()})
    context.update(prep_paginator(request, records))
    return render_to_response(template_name, context)
    
    
@login_required()
def get_record(request, object_id, rec_id=None, template_name='profile/digitize_snippet_lite.html',
         base_template='base/profile.html', embed=False, include_map=False):
    r = request.POST or request.GET
    record = None
    form_object = Form.objects.get(id=object_id)
    if rec_id:
        record = form_object.TableModel.objects.get(id=rec_id)
    
    context = RequestContext(request)

    if request.POST:
        record_form = form_object.DataEntryFormClass(request.POST, instance=record)
        if record_form.is_valid():
            instance = record_form.instance
            instance.manually_reviewed = True
            instance.save(user=request.user)
            #query for next record
            if r.get('next_record') in ['1', 'true', True]:
                record_new = form_object.get_next_record(last_id=id)
                if record_new is not None:
                    record = record_new
                    record_form = form_object.DataEntryFormClass(instance=record)
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
                'error_message': 'There were errors when updating this data record.  \
                                Please review message(s) below.'
            })
    else:
        record_form = form_object.DataEntryFormClass(instance=record)
    
    if embed: base_template = 'base/iframe.html'
    context.update({
        'base_template': base_template,
        'embed': embed,
        'form': record_form,
        'form_object': form_object,
        'record': record,
        'include_map': include_map,
        'form_id': object_id,
        'table_name': form_object.table_name,
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

        if source_attachment.source_scan is not None:
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

@login_required()
def delete_batch(request, object_id, base_template='base/profile.html', embed=False, ):
    from django.http import HttpResponse
    import json
    r = request.POST
    ModelClass = Form.objects.get(id=object_id).TableModel
    rec_ids = r.getlist('id')
    num_deletes = 0
    if embed: base_template = 'base/iframe.html'
    message = ''
    if len(rec_ids) > 0:
        groups = list(ModelClass.objects.filter(id__in=rec_ids))
        for g in groups:
            g.delete()
            num_deletes = num_deletes+1
            
    message = message + '%s %s(s) were deleted.' % (num_deletes, ModelClass.model_name)
    return HttpResponse(json.dumps({'message': message }))

'''

@process_identity  
def delete_objects(request, identity=None):
    r = request.GET or request.POST
    ids = r.getlist('id')
    form_id = int(r.get('form_id'))
    form = Form.objects.get(id=form_id)
    message = form.delete_records_by_ids(ids, identity)
    return HttpResponse(json.dumps({'message': message }))
    
@process_identity  
def update_blank_status(request, identity=None):
    r = request.GET or request.POST
    ids = r.getlist('id')
    is_blank = r.get('is_blank', False) in ['1', 'True', 'true']
    form_id = int(r.get('form_id'))
    form = Form.objects.get(id=form_id)
    message = form.update_blank_status(ids, identity, is_blank)
    return HttpResponse(json.dumps({'message': message }))
    
@process_identity
def move_to_project(request, identity=None):
    message = "Todo:  also move snippet, attachment, associated scan, \
              marker (potentially), and create new entry in the \
              at_prints_projects table.  Not implemented yet."
    return HttpResponse(json.dumps({'message': message }))

    
def export_file(format, ext, username, form, project=None, driver=None,
                extra_filters=None):
    #http://www.bostongis.com/PrinterFriendly.aspx?content_name=ogr_cheatsheet
    from datetime import datetime
    path = settings.USER_MEDIA_ROOT + '/media/%s/downloads/%s' % \
                        (username, format)
    virtual_path = settings.SERVER_URL + '/static/media/%s/downloads/%s/' % \
                    (username, format)
    prefix = form.table_name
    if project is not None:
        prefix = '%s_project_%s' % (form.table_name, project.id)
    prefix += '_%s' % datetime.now().microsecond
    file_name = '%s.%s' % (prefix, ext)
    
    if not os.path.exists(path):
        os.makedirs(path, mode=0755)
    
    file_path = '%s/%s' % (path, file_name)
    
    template_name = 'profile/tables.html'
     
    ordering_field = '-id'
    
    # extras clause used to alias the columns for human readability:
    values = ['id', 'owner__username', 'snippet__source_attachment__id', 'point',
              'source_marker__id', 'snippet__source_attachment__source_scan__id']
    extras = {
        'snippet_path':
            '\'http://\' || site_snippet.host || ' +
            'site_snippet.virtual_path || ' +
            'site_snippet.file_name_orig',
        'form_path':
            'select \'http://\' || a.host || \'/static/attachments/\' || a.uuid || \'/\' || ' +
            'a.file_name_orig from site_attachment a ' +
            'where a.id = site_snippet.source_attachment_id',
        'map_path':
            'select \'http://\' || s.host || \'/static/scans/\' || ' +
            's.uuid || \'/\' || s.file_name_orig from site_scan s ' +
            'where s.id = site_attachment.source_scan_id',
        'project_name':
            'select p.name from site_project p where p.id = ' +
            form.table_name + '.project_id',
        'number': form.table_name + '.user_num'
    }
    for f in form.get_fields():
        #remove all non-alpha-numeric chars from column alias:
        alias = ''.join(c for c in f.col_alias if c.isalnum())
        if alias.lower() == 'description': alias = 'Observation_Description'
        extras[alias] = form.table_name + '.' + f.col_name        
    values.extend(extras.keys())
    
    objects = (form.TableModel.objects
               .extra(extras)
               .values_list(*values)
               .order_by('id', 'num'))
    if project is not None:
        objects = objects.filter(project=project)
        
    if extra_filters is not None:
        for filter in extra_filters:
            objects = objects.filter(**filter)    
        
    #delete after OUSD export:
    #objects = objects.exclude(project__id__in=[54,88])
    
    sql = str(objects.query)
    # -------------------------------------------------------------
    # SV: a HACK that ensure that if a record doesn't have
    #     a corresponding paper artifact, it still gets exported!
    # -------------------------------------------------------------
    sql = sql.replace('INNER JOIN', 'LEFT OUTER JOIN')    
    #remove file from file system:
    if os.path.exists(file_path): os.remove(file_path)
    
    if driver is None: driver = format.upper()
    command_array = [
        'ogr2ogr',
        '-f', '"' + driver + '"', '"' + file_path + '"',
        'PG:"host=', settings.HOST,
        'port=', settings.PORT,
        'user=', settings.USERNAME,
        'dbname=', settings.DATABASE,
        'password=', settings.PASSWORD + '"',
        '-sql', '"' + sql + '"'
    ]
    if format.lower() == 'csv':
        #required for csv to output geometry
        command_array.extend([
            '-lco', 'GEOMETRY=AS_XY'
        ])
    elif format.lower() == 'kml':
        #form_name = ''.join(c for c in form.name if c.isalnum())
        form_name = form.name
        command_array.extend([
            '-dsco', 'Namefield=id',
            #'-dsco', 'DescriptionField=col_1',
            '-nln', '"' + form_name + '"'
        ])
        
    command = ' '.join(command_array)
    result = os.popen(command)
    responses = []
    for line in result.readlines():
        responses.append(line)
        
    if format.lower() == 'shapefile':
        #zip it:
        import zipfile, fnmatch
        #note: the '_format' is important, to avoid recursion when adding to zip.
        file_name = '%s_%s.zip' % (prefix, format) 
        file_path = '%s/%s' % (path, file_name)
        zip_archive= zipfile.ZipFile(file_path, mode='w')
        for nm in os.listdir(path):
            if fnmatch.fnmatch(nm, prefix + '.*'):
                full= os.path.join(path, nm)
                zip_archive.write(full, arcname='%s/%s' % (prefix, nm))
        zip_archive.close()
    #return HttpResponse(command)
    
    def _encrypt_media_path(path):
        import base64 
        return '%s/profile/%s/%s/' % (settings.SERVER_URL, 'tables', base64.b64encode(path))
    
    relative_path = '/static/media/%s/downloads/%s/' % (username, format)
    encrypted_path = _encrypt_media_path(relative_path + file_name)
    
    return HttpResponse(json.dumps({
        'message': command,
        'responses': responses,
        'path': encrypted_path, #virtual_path + file_name,
        'file_name': file_name
    }))
  
@process_identity
def download(request, format='shapefile', identity=None):
    # to subset the table:
    # http://stackoverflow.com/questions/3016682/split-or-save-a-subset-of-a-esri-shape-shp-file-to-a-new-file
    r = request.GET or request.POST
    form_id = int(r.get('form_id'))
    project_id = r.get('project_id')
    where = r.get('where', None)
        
    project = None
    if project_id is not None:
        if project_id in ['all', 'all#', '']:
            project = None
        else:
            try:
                project = Project.objects.get(id=project_id)
            except Project.DoesNotExist:
                project = None
            
    form = Form.objects.get(id=form_id)
    
    filters = []
    try:
        dummy_rec = form.TableModel()
        if where is not None:
            where_list = where.split('|')
            for w in where_list:
                field_name, val = w.split('=')[0], w.split('=')[1]
                try:
                    test = dummy_rec.__getattribute__(field_name)
                    d = {}
                    d[field_name] = "'" + val + "'"
                    filters.append(d)
                except:
                    pass
    except:
        filters = []
    if len(filters) == 0: filters = None

    #create directories:
    if format.lower() == 'kml':
        return export_file('kml', 'kml', request.user.username, form,
                                project=project, extra_filters=filters)
    elif format.lower() == 'csv':
        return export_file('csv', 'csv', request.user.username, form,
                                project=project, extra_filters=filters)
    else:
        return export_file('shapefile', 'shp', request.user.username, form,
                                project=project, driver='ESRI Shapefile',
                                extra_filters=filters)

'''
