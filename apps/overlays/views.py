from localground.apps.overlays.models import Marker
from django.db import connection, transaction
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
import simplejson as json
from localground.apps.uploads.models import *
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.helpers.api.decorators import process_identity
from django.shortcuts import render_to_response
from django.template import RequestContext

@login_required()
def save_marker(request):
    from datetime import datetime
    r = request.POST or request.GET
    marker_id = int(r.get('id', -1))
    marker_name = r.get('markerName', '')
    color = r.get('color', 'CCCCCC')
    photoIDs = json.loads(r.get('photoIDs'))
    audioIDs = json.loads(r.get('audioIDs'))
    videoIDs = json.loads(r.get('videoIDs'))
    
    storeID = r.get('storeID', None)
    store_name = r.get('newStoreName', None)
    #reviewTable = r.get('reviewTable', None)
    scan = Scan.objects.get(id=r.get('scanID'))
    the_geom = 'POINT(' + r.get('lng') + ' ' + r.get('lat') + ')'
    related_table = 'grocers'
    
    '''
    1) Insert tags, comments, attachments to uploads_notes (unique by marker_id, scan_id)
    2) If store specified:
        - insert if doesn't exist
        - get corresponding marker:
            - get existing marker if there is already one that references the store id
            - otherwise, create new one and copy store's precise geometry into marker's
                geometry
        - add / update store_form entry (unique by composite key of scan_id + store_id key)
    3) If rating specified:
        - add / update store_form entry (unique by composite key of scan_id + marker_id key)
    4) Photos:  no change
    5) Videos:  no change
    6) Audio:  no change
                
    '''
    
    if store_name is not None:
        #insert a new record into the grocers table:
        cursor = connection.cursor()
    
        # Insert new store and return sequence-generated PK:
        cursor.execute("INSERT INTO grocers(name, the_geom, latitude, longitude, \
                       verified, is_new) values(%s, ST_GeometryFromText(%s, 4326), %s, %s, %s, %s) returning gid",
                       [store_name, the_geom, float(r.get('lat')), float(r.get('lng')), True, True])
        transaction.commit_unless_managed()
        storeID = cursor.fetchone()[0]
    elif storeID is not None:
        cursor = connection.cursor()
        # Insert new store and return sequence-generated PK:
        cursor.execute("UPDATE grocers set verified = %s where gid = %s", [True, storeID])
        transaction.commit_unless_managed()
                
    #create new marker and save it:
    if marker_id == -1:
        marker = Marker()
    else:
        marker = Marker.objects.get(id=marker_id)
        marker.remove_dependencies()
    marker.point = GEOSGeometry(the_geom)
    marker.color = color
    marker.source_print = scan.source_print
    marker.name = marker_name
    if storeID is not None:
        marker.related_table = related_table
        marker.related_id = storeID
    else:
        marker.related_table = None
        marker.related_id = None    
    marker.save()
    
    audio = Audio.objects.filter(id__in=audioIDs)
    photos = Photo.objects.filter(id__in=photoIDs)
    videos = Video.objects.filter(id__in=videoIDs)
    for p in photos:
        p.source_scan = scan
        p.source_marker = marker
        p.save()
    
    for a in audio:
        a.source_scan = scan
        a.source_marker = marker
        a.save()
        
    for v in videos:
        v.source_scan = scan
        v.source_marker = marker
        v.save()
    
    
    #process review object
    if r.get('review') is None:
        return HttpResponse(json.dumps(marker.to_dict()))
      
    #if a review is also being submitted, process here:  
    review = json.loads(r.get('review'))
    review_id = int(review['id'])
    
    if review_id != -1:
        try:
            r = Review.objects.get(id=review_id)
        except:
            r = Review()
    else:
        r = Review()
    r.source_marker = marker
    r.user = request.user
    if scan is not None:
        r.source_scan = scan
    r.save()
    
    #process note object
    note = review['note']
    
    #validation:
    is_valid = False
    for x in [note.get('notes'), note.get('tags'), note.get('snippetID')]:
        if x is not None and len(x) > 1:
            is_valid = True
            break
    if not is_valid:
        return HttpResponse('A note must have tags, a description, or a snippet id')
    
    #insert/update:    
    if review_id != -1:
        try:
            n = Note.objects.get(source_review__id=r.id)
        except:
            n = Note()    
    else:
        n = Note()
    n.user = request.user
    n.source_review = r
    if note.get('notes') is not None:
        n.description = note.get('notes')
    if note.get('tags') is not None and len(note.get('tags')) > 0:
        n.tags = note['tags']
    if note.get('snippetID') is not None and note.get('snippetID') != '-1':
        n.source_snippet = Snippet.objects.get(id=int(note['snippetID']))
    if scan is not None:
        n.source_scan = scan
    n.save()
        

    # Insert/update user form entry:
    form = review['form']
    table = form['dataTable']
    #check to see if record already exists in table:
    cursor = connection.cursor()
    cursor.execute('SELECT ID FROM ' + table + ' where ID=%s', [r.id])
    rec_exists = cursor.rowcount == 1
    review_id = 25
    
    if table == 'form_1_grocery':
        # id, marker_id, rating, category, time_created, review_id
        rating, store_class = form['rating'], form['storeClass']
        if rec_exists:
            cursor.execute('update ' + table + ' set rating=%s, category=%s, user_id=%s \
                           where review_id=%s returning id', [rating, store_class, r.id, request.user.id])
        else:
            cursor.execute('insert into ' + table + '(rating, category, \
                           time_created, review_id, user_id) values(%s, %s, %s, %s, %s) returning id',
                    [rating, store_class, datetime.now(), r.id, request.user.id])
        transaction.commit_unless_managed()
    else:
        rating = form['rating']
        if rec_exists:
            cursor.execute('update ' + table + ' set rating=%s, user_id=%s \
                           where review_id=%s returning id', [rating, r.id, request.user.id])
        else:
            cursor.execute('insert into ' + table + '(rating, time_created, review_id, user_id) \
                           values(%s, %s, %s, %s) returning id',
                    [rating, datetime.now(), r.id, request.user.id])
        transaction.commit_unless_managed()
        
    
        
    #return more detailed json representation of marker:
    return HttpResponse(json.dumps(marker.to_dict()))
    
@login_required()
def delete_marker(request):
    from django.core.exceptions import ObjectDoesNotExist
    try:
        d = request.POST or request.GET
        marker_id = int(d.get('id', -1))
        marker = Marker.objects.get(id=marker_id)
        marker.remove_everything()
        marker.delete()
        return HttpResponse(json.dumps({'id': marker_id, 'message': 'successfully deleted'}))
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'id': marker_id, 'message': 'marker does not exist for id: ' +
                                        str(marker_id)}))     

    
@process_identity
def show_marker_detail(request, identity=None, embed=False,
                 template_name='twitter/marker_detail.html', base_template='base/base.html'):
    extras = { 'embed': embed, 'base_template': base_template }
    return render_to_response(template_name, extras,
                              context_instance = RequestContext( request))
    