from localground.apps.helpers.generic import prep_paginator
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
    
@process_identity
@process_project 
def get_objects(request, identity=None, project=None, return_message=None,
                    format_type='table'):
    context = RequestContext(request)
    r = request.GET or request.POST
    objects = None
    object_type = 'tables'
    template_name = 'profile/tables.html'
    is_blank = r.get('is_blank', False) in ['1', 'True', 'true']
    
    #query for user, forms, and projects:
    username = identity.username if identity is not None else 'all'
     
    forms, projects = None, None
    if request.user.is_superuser and username == 'all':
        projects = Project.objects.all().order_by('name')
        forms = Form.objects.all_forms()
    else:
        projects = Project.objects.get_objects(identity)
        forms = Form.objects.my_forms(user=identity)
    project_id = 'all'
    if project is not None: project_id = str(project.id)
    
    form_id = int(r.get('form_id', request.COOKIES.get('form_id_' + request.user.username, -1)))
    form = None
    try:
        if form_id != -1:
            form = Form.objects.get(id=form_id)
    except Form.DoesNotExist:
        form = None
        #context.update(dict(message='Form ID #%s not found' % form_id))
    if form is None and len(forms) > 0:
        form = forms[0] 
    records = []
    if form is not None:
        attachment = None
        if r.get('attachment_id') is not None:
            try:
                attachment = Attachment.objects.get(id=int(r.get('attachment_id')))
            except:
                attachment = None
        records = form.get_data(project=project, identity=identity,
                                    is_blank=is_blank, has_geometry=False,
                                    attachment=attachment)
    
    #build urls (for restful interface):
    url = '/profile/%s/?is_blank=%s&format_type=%s' % (object_type, is_blank, format_type)
    context.update({
        'username': username,
        'url': url,
        'raw_url': '/profile/%s/' % (object_type),
        'projects': list(projects),
        'form': form,
        'forms': list(forms),
        'selected_project': project,
        'selected_project_id': project_id,
        'object_type': 'table',
        'format_type': format_type,
        'is_blank': is_blank,
        'style': r.get('style',
                    request.COOKIES.get('style_' + request.user.username, 'default'))
    })
    if return_message is not None:
        context.update({ 'return_message': return_message })
    if request.user.is_superuser:
        context.update({'users': Project.get_users()})
    context.update(prep_paginator(request, records))
    return render_to_response(template_name, context)
    
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

'''
def _make_shapefile(username, table_name):
    import zipfile, fnmatch
    media_path, shapefile_path = _make_download_directory(username, table_name)
  
    command_array = [
        'pgsql2shp',
        '-f', '%s/%s.kml' % (shapefile_path, table_name),
        '-h',  settings.HOST,
        '-p', settings.PORT,
        '-u', settings.USERNAME,
        '-P %s' % settings.PASSWORD,
        settings.DATABASE,
        table_name
    ]
    command = "'" + "' '".join(command_array) + "'"
    result = os.popen(command)
    responses = []
    for line in result.readlines():
       responses.append(line)

    #add to zip file:   
    zip_filename = '%s_%s.zip' % (table_name, format)
    zip_filepath = '%s/%s' % (media_path, zip_filename)
    zip_archive= zipfile.ZipFile(zip_filepath, mode='w')
    for nm in os.listdir(shapefile_path):
        if fnmatch.fnmatch(nm,table_name + '*'):
            full= os.path.join( shapefile_path, nm )
            zip_archive.write(full, arcname='%s/%s' % (format, nm))
    zip_archive.close()

    
    return HttpResponse(json.dumps({
        #'message': command,
        'path': settings.SERVER_URL + '/static/media/' + username + '/downloads/' +
                zip_filename,
        'file_name': zip_filename,
        'media_path': media_path,
        'shapefile_path': shapefile_path,
        'responses': responses
    }))'''
    
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

