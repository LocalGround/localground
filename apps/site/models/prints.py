from django.contrib.gis.db import models
from datetime import datetime    
from localground.apps.site.managers import PrintManager
#from localground.apps.site.models import Base
from django.conf import settings
from localground.apps.site.models import BaseMedia, BaseExtents
                                                   
class Print(BaseExtents, BaseMedia):
    name = 'print'
    name_plural = 'prints'
    project = models.ForeignKey('Project')
    uuid = models.CharField(unique=True, max_length=8)
    map_provider = models.ForeignKey('WMSOverlay',
                            db_column='fk_provider', related_name='prints_print_wmsoverlays')
    layout = models.ForeignKey('Layout')
    map_width = models.IntegerField()
    map_height = models.IntegerField()
    map_image_path = models.CharField(max_length=255)
    pdf_path = models.CharField(max_length=255)
    preview_image_path = models.CharField(max_length=255)
    map_title = models.CharField(max_length=255, null=True, blank=True, )
    description = models.TextField(null=True, blank=True)
    form_column_widths = models.CharField(max_length=200, null=True, blank=True)
    sorted_field_ids = models.CharField(max_length=100, null=True, blank=True,
                                    db_column='form_column_ids')
    form = models.ForeignKey('Form', null=True, blank=True)
    deleted = models.BooleanField(default=False)
    layers = models.ManyToManyField('WMSOverlay', null=True, blank=True)
    #projects = models.ManyToManyField('Project')
    objects = PrintManager()
    
    @classmethod
    def filter_fields(cls):
        from localground.apps.site.lib.helpers import QueryField, FieldTypes
        return [
            QueryField('project__id', id='project_id', title='Project ID', data_type=FieldTypes.INTEGER),
            QueryField('map_title', id='map_title', title='Map Title', operator='like'),
            QueryField('owner__username', id='owned_by', title='Owned By'),
            QueryField('map_image_path', id='map_image_path', title='File Name'),
            QueryField('date_created', id='date_created_after', title='After',
                                        data_type=FieldTypes.DATE, operator='>='),
            QueryField('date_created', id='date_created_before', title='Before',
                                        data_type=FieldTypes.DATE, operator='<=')
        ]
    
    def get_form_column_widths(self):
        if self.form_column_widths is None or len(self.form_column_widths) == 0:
            return []
        else:
            return [int(w) for w in self.form_column_widths.split(',')]
            
    def get_fields_sorted_by_print(self):
        widths = self.get_form_column_widths()
        if self.sorted_field_ids is None or len(self.sorted_field_ids) == 0:
            return []
        else:
            ordered_ids = [int(id) for id in self.sorted_field_ids.split(',')]
            fields_sorted = []
            fields = list(self.form.get_fields())
            for i, id in enumerate(ordered_ids):
                for f in fields:
                    if f.id == id:
                        f.display_width = widths[i]
                        fields_sorted.append(f)
            return fields_sorted                
    
    def name(self):
        return self.map_title
        
    def get_abs_directory_path(self):
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)
    
    def get_abs_virtual_path(self):
        return 'http://%s%s' % (self.host, self.virtual_path)
        
    #@property
    #def virtual_path(self):
    #    return '/%s/prints/%s' % (settings.USER_MEDIA_DIR, self.uuid)
    
    def generate_relative_path(self):
        return '/%s/%s/%s/' % (settings.USER_MEDIA_DIR,
                                     self._meta.verbose_name_plural, self.uuid)
        
    def thumb(self):
        path = '%s%s' % (self.virtual_path, self.preview_image_path)
        return self._encrypt_media_path(path)
    
    def map(self):
        path = '%s%s' % (self.virtual_path, self.map_image_path)
        return self._encrypt_media_path(path)
    
    def pdf(self):
        path = '%s%s' % (self.virtual_path, self.pdf_path)
        return self._encrypt_media_path(path)
    
    def to_dict_slim(self):
        return {
            'id': self.id,
            'map_title': self.map_title 
        }
    
    def to_dict(self, include_print_users=False, include_map_groups=False,
                include_processed_maps=False, include_markers=False):
        dict = {
            'id': self.uuid,
            'uuid': self.uuid,
            'map_title': self.map_title,
            'pdf': self.pdf(),
            'thumbnail': self.thumb(),
            #'kml': '/' + settings.USER_MEDIA_DIR + '/prints/' + self.id + '/' + self.id + '.kml',
            'map': self.map(),
            'mapWidth': self.map_width,
            'mapHeight': self.map_height,
            'zoomLevel': self.zoom,
            'north': self.northeast.y,
            'south': self.southwest.y,
            'east': self.northeast.x,
            'west': self.southwest.x,
            'center_lat': self.center.y,
            'center_lng': self.center.x,
            'time_stamp': self.time_stamp.strftime('%m/%d/%y %I:%M%p'),#.isoformat(), #m/d/Y
            #'time_stamp': str(self.time_stamp),
            'provider': self.map_provider.id, #ensure select_related
        }
        if self.owner is not None:
            dict.update({'owner': self.owner.username})  #ensure select_related 
        
        '''if self.time_stamp:
            dict.update({})
            
        if self.view_authority:
            dict.update({ 
            })'''
        if include_print_users:
            users = self.get_auth_users()
            dict.update({'print_users': [u.to_dict() for u in users]})
        if include_map_groups:
            groups = self.get_map_groups()
            dict.update({'map_groups': [g.to_dict() for g in groups]})
        if include_processed_maps:
            dict.update({'processed_maps': self.get_scans(to_dict=True)})
        if include_markers:
            dict.update({'markers': self.get_marker_dictionary_list()})    
        return dict
    
    
    '''def get_auth_users(self):
        from localground.apps.site.models import PrintUser
        return (PrintUser.objects.select_related('auth_user')
                .filter(source_print=self).order_by('auth_user__username',))
        
    def get_map_groups(self):
        from localground.apps.site.models import MapGroupPrint
        return (MapGroupPrint.objects.select_related('map_group')
                .filter(source_print=self).order_by('map_group__name',))'''
        
    def get_marker_dictionary_list_group_by_scan(self):
        from localground.apps.site.models import Marker
        return Marker.objects.get_marker_dict_by_print(self.id, group_by_scan=True)
        
    def get_marker_dictionary_list(self):
        from localground.apps.site.models import Marker
        return Marker.objects.get_marker_dict_by_print(self.id, group_by_scan=False)
    
    def get_scans(self, to_dict=False):
        from localground.apps.site.models import Scan
        from localground.apps.site.models import Marker
        scans = list(Scan.objects.filter(deleted=False)
                     .filter(source_print=self)
                     .order_by('-time_stamp'))
        if to_dict:
            return [s.to_dict() for s in scans]
        return scans
    
    def get_markers(self):
        return Marker.objects.filter(source_print=self).order_by('name',)
        
    def delete(self, *args, **kwargs):
        #first remove directory, then delete from db:
        import shutil, os
        path = self.get_abs_directory_path()
        if os.path.exists(path):
            dest = '%s/deleted/%s' % (settings.USER_MEDIA_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.apps.site.lib.helpers import generic
                dest = dest + '.dup.' + generic.generateID()
            shutil.move(path, dest)
                    
        super(Print, self).delete(*args, **kwargs) 
    
    class Meta:
        ordering = ['id']
        verbose_name = "print"
        verbose_name_plural = "prints"
        app_label = 'site'
        
    def __unicode__(self):
        return 'Print #' + self.uuid