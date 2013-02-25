from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q

#------------------------------------------
# Base Class for general functionality
class GeneralMixin(object):
    '''def by_project(self, prj):
        return (self.model.objects
                    .filter(project=prj)
                    .exclude(deleted=True))'''

    def get_model_name(self):
        n = self.model._meta.verbose_name
        if self.model._meta.verbose_name == 'scan':
            n = 'map image'
        return n
    def get_model_name_plural(self):
        n = self.model._meta.verbose_name_plural
        if self.model._meta.verbose_name_plural == 'scans':
            n = 'map images'
        return n
        
    def get_all(self, ordering_field=None, user=None):
        q = self.model.objects.distinct().select_related('project', 'source_scan',
                                              'source_marker', 'owner',
                                              'last_updated_by')
        if user is not None:
            #q = q.filter(Q(project__owner=user) | Q(project__projectuser__user=user))
            q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        else:
            q = q.all()
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q
    
    def by_project(self, prj, ordering_field=None):
        return self.by_projects([prj.id], ordering_field=ordering_field)
    
    def by_projects(self, project_ids, ordering_field=None):
        q = (self.model.objects
                    .select_related('project__id', 'project__name')
                    .filter(project__in=project_ids))
                    #.exclude(deleted=True))
        if ordering_field is not None:
            q =  q.order_by(ordering_field, )
        return q
    
    def delete_by_ids(self, id_list, user):
        objects = []
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.model.objects.filter(id__in=id_list))
            for o in objects:
                #important:  delete does a cascading delete!
                #todo:  remove from file system too
                o.delete()
                num_deletes = num_deletes+1
                
        return '%s %s(s) were deleted.' % (num_deletes, self.get_model_name())
    
    
    #Todo:  this needs to be revamped; potentially turn into a database function?
    def move_project(self, project_id, item_list, confirm=False):
        #return self.model._meta.verbose_name_plural
        #return self.model._meta.verbose_name
        '''
        This method returns a string that explains what happened
        '''
        from localground.uploads.models import Photo, Scan, Audio, Video
        from localground.overlays.models import Marker
        from localground.prints.models import Print
        from localground.account.models import Project
        from django.db.models import Q
        
        if item_list is None or len(item_list) == 0:
            return 'The list of %s must not be empty' % (self.get_model_name_plural())
        
        
        scan_ids, marker_ids, photo_ids, audio_ids, video_ids, \
            review_ids = [], [], [], [], [], []
        scan_names, marker_names = [], []
        scan_message, marker_message, photo_message, audio_message , \
            video_message, review_message = '', '', '', '', '', ''
        
        #########################
        # Get Scans and Markers #
        #########################
        if isinstance(self, ScanManager):
            scan_dependencies = list(self.model.objects.filter(id__in=item_list)
                                     .order_by('id'))
            scan_ids = [o.id for o in scan_dependencies]
            scan_names = [o.name for o in scan_dependencies]
            
            #TODO:  This needs to be revamped to accomodate dynamic forms:
            #marker_dependencies = (Review.objects.select_related(
            #    'source_marker', 'source_marker__id', 'source_marker__name')
            #                       .filter(source_scan__id__in=scan_ids))
            #marker_ids = set([o.source_marker.id for o in marker_dependencies])
            #marker_names = set([o.source_marker.get_name() for o in marker_dependencies])
        else:
            #are there any scans referenced?
            scan_dependencies = list(self.model.objects.distinct()
                          .values_list('source_scan__id','source_scan__name')
                          .filter(id__in=item_list))
            
            #are there any markers referenced?
            #marker_dependencies = list(self.model.objects.distinct()
            #              .values_list('source_marker__id', 'source_marker__name')
            #              .filter(id__in=item_list))
            #make lists distinct and non-null:
            for o in scan_dependencies:
                if o[0] is not None: scan_ids.append(o[0])
                if o[1] is not None and len(o[1]) > 0: scan_names.append(o[1])
            scan_ids, scan_names = set(scan_ids), set(scan_names)
            if len(scan_ids) > 0:
                scan_message = '''
                <li>%s related map image(s): <ul><li>%s</li></ul></li>
                ''' % (len(scan_ids), '</li><li>'.join(str(x) for x in scan_names))
        
            #for o in marker_dependencies:
            #    if o[0] is not None: marker_ids.append(o[0])
            #    if o[1] is not None and len(o[1]) > 0: marker_names.append(o[1])
            #marker_ids, marker_names = set(marker_ids), set(marker_names)
        if len(marker_ids) > 0:
            marker_message = '''
            <li>%s related markers(s): <ul><li>%s</li></ul></li>
            ''' % (len(marker_ids), '</li><li>'.join(str(x) for x in marker_names))

        #########################################
        # Get Photos, Audio, Video, and Reviews #
        #########################################
        # query for second order data (data related to parent scans and markers);
        # note that there might not be second-order data:
        if len(marker_ids) > 0 and len(scan_ids) > 0:
            filter_expression = (Q(source_marker__id__in=marker_ids) |
                             Q(source_scan__id__in=scan_ids))
        elif len(marker_ids) > 0:
            filter_expression = Q(source_marker__id__in=marker_ids)
        elif len(scan_ids) > 0:
            filter_expression = Q(source_scan__id__in=scan_ids)
        else:
            filter_expression = None
        
        def get_lists(class_name, item_list, filter_expression,
                        name_field='name', prefix=''):
            ids, names, message = [], [], ''
            object_list = list(class_name.objects.filter(filter_expression).values()
                            .order_by(name_field))
            if len(object_list) > 0:
                if self.model._meta.verbose_name == class_name.__name__.lower():
                    for o in object_list:
                        if str(o.get('id')) not in item_list:
                            ids.append(o.get('id'))
                            names.append(o.get(name_field))
                else:
                    ids = [o.get('id') for o in object_list]
                    names = [str(o.get(name_field)) for o in object_list]
                
                delimiter = '</li><li>' + prefix   
                message = message + '''
                <li>%s related %s(s): <ul><li>%s%s</li></ul></li>
                ''' % (len(ids), class_name.__name__.lower(), prefix, delimiter.join(names))
            return ids, names, message
        
        #return get_lists(Photo, item_list, filter_expression)
        if filter_expression is not None:  
            photo_ids, photo_names, photo_message = get_lists(Photo, item_list, filter_expression)
            audio_ids, audio_names, audio_message  = get_lists(Audio, item_list, filter_expression,
                                                name_field='file_name_orig')
            video_ids, video_names, video_message  = get_lists(Video, item_list, filter_expression,
                                                name_field='file_name_orig')
            #review_ids, review_names, review_message = get_lists(Review, item_list, filter_expression,
            #                                    name_field='id', prefix='Review #')
        
        if confirm:
            #some grammar pre-processing:
            object_name, article, verb = self.get_model_name_plural(), 'these', 'are'
            if len(item_list) == 1:
                object_name = self.model._meta.verbose_name
                article = 'this'
                verb = 'is'
                
            #build the message:
            message =  '''
                You requested that %(num_objects)s %(object_name)s be moved to a new project.
                ''' % dict(
                num_objects=str(len(item_list)), object_name=object_name,
                article=article, verb=verb)
            if len(marker_message) > 0 or len(photo_message) > 0 or \
                len(audio_message) > 0 or len(video_message) or len(review_message) > 0:
                message = message + '''
                    Because %(article)s %(object_name)s %(verb)s tied to other markers and map images,
                    all dependent objects will also be moved to the new project.
                    Therefore, the following additional objects will also be moved:<br>
                    <ul class="dark-list">''' % dict(
                    num_objects=str(len(item_list)), object_name=object_name,
                    article=article, verb=verb)
            
                message = (message + scan_message + marker_message + photo_message +
                           audio_message + video_message + review_message)
            
            #move reviews but don't output them to the user (too confusing)
            #message = message + review_message 
            message = message + '</ul>'
            return message
        
        else: #do commit:
            #query for project:
            project = None
            if project_id is not None:
                try:
                    project = Project.objects.get(id=int(project_id))
                except Project.DoesNotExist:
                    return 'Project does not exist for project #' + str(project_id)
                except ValueError:
                    return str(project_id) + ' must be an integer'
            
            #consolidate lists:
            if isinstance(self, ScanManager):
                scan_ids.extend(item_list)
            elif isinstance(self, PhotoManager):
                photo_ids.extend([int(o) for o in item_list])
            elif isinstance(self, AudioManager):
                audio_ids.extend([int(o) for o in item_list])
            elif isinstance(self, VideoManager):
                video_ids.extend([int(o) for o in item_list])
            
            
            # 1) associate any prints associated with scan_list to new project:
            if len(scan_ids) > 0:
                object_list = Print.objects.distinct().filter(scan__id__in=scan_ids)
                for o in object_list:
                    o.projects.add(project)
                
            # 2) update photos:
            #item_list.extend(additional_photo_ids)
            if len(item_list) > 0:
                object_list = Photo.objects.distinct().filter(id__in=photo_ids).order_by('id')
                for o in object_list:
                    o.project = project
                    o.save()
            
            # 3) update audio:
            if len(audio_ids) > 0:
                object_list = Audio.objects.distinct().filter(id__in=audio_ids).order_by('id')
                for o in object_list:
                    o.project = project
                    o.save()
                
            # 4) update video:  
            if len(video_ids) > 0: 
                object_list = Video.objects.distinct().filter(id__in=video_ids).order_by('id')
                for o in object_list:
                    o.project = project
                    o.save()
                
            # 5) update reviews: 
            #if len(review_ids) > 0:   
            #    object_list = Review.objects.distinct().filter(id__in=review_ids).order_by('id')
            #    for o in object_list:
            #        o.project = project
            #        o.save()
                
            # 6) update map images: 
            if len(scan_ids) > 0:   
                object_list = Scan.objects.distinct().filter(id__in=scan_ids).order_by('id')
                for o in object_list:
                    o.project = project
                    o.save()
                    
            # 7) update markers: 
            if len(scan_ids) > 0:   
                object_list = Marker.objects.distinct().filter(id__in=marker_ids).order_by('id')
                for o in object_list:
                    o.project = project
                    o.save()
                
            message =  'The following objects have been moved to the "%s" Project:<ul class="dark-list"> \
                    <li>%s map images(s)</li> \
                    <li>%s markers(s)</li> \
                    <li>%s photos(s)</li> \
                    <li>%s audio file(s)</li> \
                    <li>%s videos(s)</li> \
                    <li>%s reviews(s)</li></ul> \
                    ' % (project.name , len(set(scan_ids)), len(set(marker_ids)),
                         len(set(photo_ids)), len(set(audio_ids)), len(set(video_ids)),
                         len(set(review_ids)))
            
            return message
            
            
        
    def to_dict_list(self):
        if len(list(self)) == 0: return []
        return [p.to_dict() for p in self]
#------------------------------------------
        
class ScanMixin(GeneralMixin):
    def by_project(self, project_id, processed_only=False, ordering_field='name'):
        return self.by_projects([project_id], processed_only=processed_only,
            ordering_field=ordering_field)
    
    #override default:
    def by_projects(self, project_ids, processed_only=False, ordering_field='name'):
        q = self.model.objects
        q = (q.select_related('project__id', 'project__name', 'source_print',
                              'status', 'processed_image', 'last_updated_by', 'owner')
                    .filter(project__in=project_ids))
                    #.exclude(deleted=True))
        if processed_only:
            q = q.filter(status=2).filter(processed_image__isnull=False)
        
        if ordering_field is not None:
            q =  q.order_by(ordering_field,)
        else:
            q =  q.order_by('id',)
        return q
    

    def get_all(self, processed_only=False, ordering_field=None, user=None):
        q = self.model.objects.distinct()
        if processed_only:
            q = q.filter(status=2).filter(source_print__isnull=False)
        q = self.model.objects
        if user is not None:
            #q = q.filter(Q(project__owner=user) | Q(project__projectuser__user=user))
            q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        q = (q.select_related('project__id', 'source_print', 'status',
                              'last_updated_by', 'owner'))
                    #.exclude(deleted=True))
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        else:
            q =  q.order_by('id',)
        return q
    
    '''def reprocess_by_ids(self, id_list, user):
        from localground.tasks import process_map
        objects = []
        num_reprocessed = 0
        if len(id_list) > 0:
            objects = list(self.model.objects.filter(id__in=id_list))
            for o in objects:
                #reprocess map:
                process_map.delay(o.uuid)
                num_reprocessed = num_reprocessed+1
                
        return '%s %s(s) were submitted for re-processing.' % \
            (num_reprocessed, self.get_model_name())'''
        
    '''def processed_scans(self, user=None):
        return self
        q = (self.model.objects.filter(status=2)
             .select_related('source_print__id')
             .filter(source_print__isnull=False))
        if user is not None:
            q.filter(user=user)
        return q.order_by('time_stamp')'''
        
    def failed_scans(self, user=None):
        q = self.model.objects.filter(status__in=(4,))
        if user is not None and not user.is_superuser:
            q.filter(owner=user)
        return q.order_by('time_stamp')
        
    def scans_in_queue(self, user=None):
        q = self.model.objects.filter(status__in=(1,))
        if user is not None:
            q.filter(owner=user)
        return q.order_by('time_stamp')

class ScanQuerySet(QuerySet, ScanMixin):
    pass
        
class ScanManager(models.GeoManager, ScanMixin):
    def get_query_set(self):
        return ScanQuerySet(self.model, using=self._db)
        
class PhotoMixin(GeneralMixin):
    
    def get_all(self, ordering_field=None, user=None):
        q = self.model.objects.distinct().select_related('project', 'source_scan', 'source_marker',
                                    'owner', 'last_updated_by')
        if user is not None:
            #q = q.filter(Q(project__owner=user) | Q(project__projectuser__user=user))
            q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        else:
            q = q.all()
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q
    
    def get_my_photos(self, user, printID=None, unmatched=False):
        if user is None or not user.is_authenticated():
            return []
        q = (self.model.objects
                  .select_related('project', 'source_scan', 'source_marker',
                                    'owner', 'last_updated_by')
                  .distinct()
                  .filter(Q(owner__groups__in=user.groups.all())))
                  #.exclude(deleted=True))
        if printID is not None:
            q = q.filter(source_print__id=printID)
        if unmatched:
            q = q.filter(source_scan__isnull=True)
        q = q.order_by('name', '-time_stamp')   
        return q
    
    def by_projects(self, project_ids, ordering_field=None):
        q = (self.model.objects
                    .select_related('project', 'source_scan', 'source_marker',
                                    'owner', 'last_updated_by')
                    .filter(project__in=project_ids))
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q
    
class PrintPermissionsMixin(object):
    def to_dict_list(self, include_scan_counts=False):
        if len(list(self)) == 0: return []
        if include_scan_counts:
            return [dict(p.to_dict(), num_scans=p.num_scans or 0) for p in self]
        else:
            return [p.to_dict() for p in self]
        
class PhotoQuerySet(QuerySet, PhotoMixin):
    pass

class PhotoManager(models.GeoManager, PhotoMixin):
    def get_query_set(self):
        return PhotoQuerySet(self.model, using=self._db)
        
class AudioMixin(GeneralMixin):
    def get_my_audio(self, user, printID=None, unmatched=False):
        if user is None or not user.is_authenticated():
            return []
        q = (self.model.objects
                  .distinct()
                  .filter(Q(user__groups__in=user.groups.all())))
                  #.exclude(deleted=True))
        if printID is not None:
            q = q.filter(source_print__id=printID)
        if unmatched:
            q = q.filter(source_scan__isnull=True)
        q = q.order_by('name', '-time_stamp')   
        return q
    
    def by_projects(self, project_ids, ordering_field=None):
        q = (self.model.objects
                    .select_related('project', 'source_scan', 'source_marker',
                                    'owner', 'last_updated_by')
                    .filter(project__in=project_ids))
        #if ordering_field is not None:
        #    q =  q.order_by(ordering_field, 'file_name_new')
        q =  q.order_by('file_name_new')
        return q
  
class AudioQuerySet(QuerySet, AudioMixin):
    pass  
class AudioManager(models.GeoManager, AudioMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)
 
class VideoMixin(GeneralMixin):
    def get_my_videos(self, user, printID=None, unmatched=False, rec_to_dict=True):
        if user is None or not user.is_authenticated():
            return []
        q = (self.model.objects
                  .distinct()
                  .filter(Q(user__groups__in=user.groups.all())))
                  #.exclude(deleted=True))
        if printID is not None:
            q = q.filter(source_print__id=printID)
        if unmatched:
            q = q.filter(source_scan__isnull=True)
        q = q.order_by('name', '-time_stamp')
        if rec_to_dict:
            return [v.to_dict() for v in q]    
        return q 

class VideoQuerySet(QuerySet, AudioMixin):
    pass
   
class VideoManager(models.GeoManager, VideoMixin):
    def get_query_set(self):
        return AudioQuerySet(self.model, using=self._db)  

'''class AttachmentManager(models.Manager):
    def get_my_attachments(self, user, printID=None, unmatched=False, rec_to_dict=True):
        if user is None or not user.is_authenticated():
            return []
        attachments = (self.model.objects.distinct()
                            .filter(Q(user__groups__in=user.groups.all())))
        if printID is not None:
            attachments = attachments.filter(source_print__id=printID)
        if unmatched:
            attachments = attachments.filter(source_scan__isnull=True)
        if rec_to_dict:
            return [a.to_dict() for a in attachments]
        return attachments'''
    

class ReviewManager(models.Manager):
    def get_reviews_by_print_id(self, print_id):
        reviews = list(
            self.model.objects.filter(source_marker__scan__source_print__id=print_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)
        
    def get_reviews_by_scan_id(self, scan_id):
        reviews = list(
            self.model.objects.filter(source_marker__scan__id=scan_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)
        
    def get_reviews_by_marker_id(self, marker_id):
        reviews = list(
            self.model.objects.filter(source_marker__id=marker_id)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self.get_reviews_by_marker_ids([marker_id])
    
    def get_reviews_by_marker_ids(self, marker_ids):
        reviews = list(
            self.model.objects.filter(source_marker__id__in=marker_ids)
                .values_list('id', 'source_marker__id', 'source_scan__id').order_by('source_marker__id')
            )
        return self._parse_reviews(reviews)

    def _parse_reviews(self, reviews): 
        #from localground.uploads.models import Note
        review_ids = [r[0] for r in reviews]
        review_ids = [r[0] for r in reviews]
        
        #todo:  group by marker
        
        #get notes:
        #notes = list(Note.objects.select_related('source_review__id', 'source_snippet').filter(source_review__id__in=review_ids))
        
        #get form_1_grocery entries:
        if len(review_ids) > 0:
            from django.db import connection
            cursor = connection.cursor()
            sql = 'SELECT id, review_id, rating, category FROM form_1_grocery where review_id in (' + ', '.join(map(str,review_ids)) + ')'
            cursor.execute(sql)
            store_reviews = cursor.fetchall()
            
            #get form_2_observation entries:
            sql = 'SELECT id, review_id, rating FROM form_2_observation where review_id in (' + ', '.join(map(str,review_ids)) + ')'
            cursor.execute(sql)
            observations = cursor.fetchall()

        review_dict_array = []
        for r in reviews:
            dict = {
                'id': r[0],
                'marker_id': r[1],
                'scan_id': r[2]
            }
            #for n in notes:
            #    if n.source_review.id == r[0]:
            #        dict.update({'note': n.to_dict()})
            if store_reviews is not None:
                for s in store_reviews:
                    if r[0] == s[1]:
                        dict.update({
                            'store_review': {
                                'id': s[0],
                                'rating': s[2],
                                'category': s[3],
                                'requery': False
                            }
                        })
            if observations is not None:
                for o in observations:
                    if r[0] == o[1]:
                        dict.update({
                            'observation': {
                                'id': o[0],
                                'rating': o[2],
                                'requery': False
                            }
                        })
            review_dict_array.append(dict)
        return review_dict_array
    
class SnippetManager(models.Manager):
    def get_snippets_by_scan_id(self, user, scan_id, to_dict=True):
        if user is None or not user.is_authenticated():
            return []
        q = (self.model.objects.distinct()
                            .filter(Q(user__groups__in=user.groups.all()))
                            .filter(source_attachment__source_scan__id=scan_id)
                            .order_by('file_name_orig')
                    )
        if to_dict:
            return [s.to_dict() for s in q]
        return snippets
    

