#!/usr/bin/env python
from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q

class GenericLocalGroundError(Exception):
    
    def __init__(self, value):
        self.value = value
        
    def __str__(self):
        return repr(self.value)

class BaseMixin(object):
        
    def get_listing(self, user, filter=None, ordering_field=None):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.model.objects.distinct().select_related('owner', 'last_updated_by')
        #q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
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
                
        return '%s %s were deleted.' % (num_deletes, self.get_model_name())
        
    def to_dict_list(self):
        return [p.to_dict() for p in self]


class GeneralMixin(BaseMixin):
    '''def by_project(self, prj):
        return (self.model.objects
                    .filter(project=prj)
                    .exclude(deleted=True))'''

        
    def get_listing(self, user, project=None, ordering_field=None):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.model.objects.distinct().select_related('project', 'source_scan',
                                              'source_marker', 'owner',
                                              'last_updated_by')
        q = q.filter(Q(project__owner=user) | Q(project__users__user=user))
        if project is not None:
             q = q.filter(project=project) 
        if ordering_field is not None:
            q =  q.order_by(ordering_field)
        return q
    
    def apply_filter(self, user, query=None, order_by=None):
        if user is None:
            raise GenericLocalGroundError('The user cannot be empty')
            
        q = self.get_listing(user)
        if query is not None: q = query.extend_query(q)
        if order_by is not None: q = q.order_by(order_by)
        return q
    
    def by_marker(self, marker, ordering_field=None):
        q = (self.model.objects
                    .select_related('project', 'source_scan', 'source_marker',
                                    'owner', 'last_updated_by')
                    .filter(source_marker=marker))
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
    
    
    
    #Todo:  this needs to be revamped; potentially turn into a database function?
    def move_project(self, project_id, item_list, confirm=False):
        #return self.model._meta.verbose_name_plural
        #return self.model._meta.verbose_name
        '''
        This method returns a string that explains what happened
        '''
        from localground.apps.site.models import Photo, Scan, Audio, Video
        from localground.apps.site.models import Marker
        from localground.apps.site.models import Print
        from localground.apps.site.models import Project
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
            
            
        
    
#------------------------------------------




