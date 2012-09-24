from django.contrib.gis.db import models
from django.db.models import Q
from datetime import datetime    
from localground.prints.managers import PrintManager, FormManager #, PrintPermissionsManager
from localground.uploads.models import Snippet, Base
from localground.prints.dynamic import ModelClassBuilder, DynamicFormBuilder
from django.conf import settings
from django.db import transaction
         

class Print(Base):
    uuid = models.CharField(unique=True, max_length=8)
    time_stamp = models.DateTimeField(default=datetime.now)
    owner = models.ForeignKey('auth.User', db_column='user_id')
    last_updated_by = models.ForeignKey('auth.User',
                                related_name='%(app_label)s_%(class)s_related')
    map_provider = models.ForeignKey('overlays.WMSOverlay',
                            db_column='fk_provider', related_name='prints_print_wmsoverlays')
    layout = models.ForeignKey('prints.Layout')
    zoom = models.IntegerField()
    map_width = models.IntegerField()
    map_height = models.IntegerField()
    host = models.CharField(max_length=255)
    map_image_path = models.CharField(max_length=255)
    pdf_path = models.CharField(max_length=255)
    preview_image_path = models.CharField(max_length=255)
    map_title = models.CharField(max_length=255, null=True, blank=True, )
    description = models.TextField(null=True, blank=True)
    form_column_widths = models.CharField(max_length=200, null=True, blank=True)
    sorted_field_ids = models.CharField(max_length=100, null=True, blank=True,
                                    db_column='form_column_ids')
    extents = models.PolygonField()
    center = models.PointField()
    northeast = models.PointField()
    southwest = models.PointField()
    form = models.ForeignKey('prints.Form', null=True, blank=True)
    deleted = models.BooleanField(default=False)
    layers = models.ManyToManyField('overlays.WMSOverlay', null=True, blank=True,
                                                 db_table='prints_print_wmsoverlays')
    projects = models.ManyToManyField('account.Project')
    objects = PrintManager()
    class Meta:
        ordering = ['uuid']
        
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
        #return '%s/prints/%s/' % (settings.STATIC_ROOT, self.uuid)
        return '%s%s' % (settings.FILE_ROOT, self.virtual_path)
        
    def get_abs_virtual_path(self):
        return 'http://%s%s' % (self.host, self.virtual_path)
        
    @property
    def virtual_path(self):
        return '/static/prints/%s' % self.uuid
        
    #def absolute_virtual_path(self):
    #    return self._encrypt_media_path(self.virtual_path + self.file_name_new) 
    
    def thumb(self):
        path = '%s/%s' % (self.virtual_path, self.preview_image_path)
        return self._encrypt_media_path(path)
    
    def map(self):
        path = '%s/%s' % (self.virtual_path, self.map_image_path)
        return self._encrypt_media_path(path)
    
    def pdf(self):
        path = '%s/%s' % (self.virtual_path, self.pdf_path)
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
            #'kml': '/static/prints/' + self.id + '/' + self.id + '.kml',
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
        from localground.account.models import PrintUser
        return (PrintUser.objects.select_related('auth_user')
                .filter(source_print=self).order_by('auth_user__username',))
        
    def get_map_groups(self):
        from localground.account.models import MapGroupPrint
        return (MapGroupPrint.objects.select_related('map_group')
                .filter(source_print=self).order_by('map_group__name',))'''
        
    def get_marker_dictionary_list_group_by_scan(self):
        from localground.overlays.models import Marker
        return Marker.objects.get_marker_dict_by_print(self.id, group_by_scan=True)
        
    def get_marker_dictionary_list(self):
        from localground.overlays.models import Marker
        return Marker.objects.get_marker_dict_by_print(self.id, group_by_scan=False)
    
    def get_scans(self, to_dict=False):
        from localground.uploads.models import Scan
        from localground.overlays.models import Marker
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
            dest = '%s/deleted/%s' % (settings.STATIC_ROOT, self.uuid)
            if os.path.exists(dest):
                from localground.lib import generic
                dest = dest + '.dup.' + generic.generateID()
            shutil.move(path, dest)
                    
        super(Print, self).delete(*args, **kwargs) 
    
    class Meta:
        db_table = u'prints'
        ordering = ['id']
        verbose_name = "print"
        verbose_name_plural = "prints"
        
    def __unicode__(self):
        return 'Print #' + self.uuid

class Layout(models.Model):
    name = models.CharField(max_length=255)
    display_name = models.CharField(max_length=255, blank=True)
    map_width_pixels = models.IntegerField()
    map_height_pixels = models.IntegerField()
    qr_size_pixels = models.IntegerField()
    border_width = models.IntegerField()
    is_active = models.BooleanField(default=True)
    is_landscape = models.BooleanField(default=False)
    is_data_entry = models.BooleanField(default=True)
    is_mini_form = models.BooleanField(default=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
            'map_width': self.map_width_pixels,
            'map_height': self.map_height_pixels
        }
    

class DataType(models.Model):
    name = models.CharField(max_length=255)
    sql = models.CharField(max_length=500)
    
    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            sql=self.sql
        )
    
class Field(models.Model):
    form = models.ForeignKey('prints.Form')
    col_name = models.CharField(max_length=255)
    col_alias = models.CharField(max_length=255)
    data_type = models.ForeignKey('prints.DataType')
    time_stamp = models.DateTimeField(default=datetime.now)
    display_width = models.IntegerField() #percentage
    
    #field to be displayed in viewer
    is_display_field = models.BooleanField(default=False)
    # temporary stop gap:  whether or not to display the field in the
    # paper print form:
    is_printable = models.BooleanField(default=True)
    has_snippet_field = models.BooleanField(default=True)
    
    #how the fields should be ordered in the data entry form:
    ordering = models.IntegerField()
    
    def to_dict(self):
        return dict(alias=self.col_alias, width_pct=self.display_width)
    
    class Meta:
        ordering = ['form__id', 'ordering']

    
class Form(models.Model):
    name = models.CharField(max_length=255)
    table_name = models.CharField(max_length=255)
    owner = models.ForeignKey('auth.User', db_column='user_id')
    time_stamp = models.DateTimeField(default=datetime.now)
    projects = models.ManyToManyField('account.Project')
    objects = FormManager()
    _model_class = None
    _data_entry_form_class = None
    
    @property
    def TableModel(self):
        if self._model_class is None:
            mcb = ModelClassBuilder(self)
            self._model_class = mcb.model_class
        return self._model_class
    
    @property
    def DataEntryFormClass(self):
        if self._data_entry_form_class is None:
            dfb = DynamicFormBuilder(self)
            self._data_entry_form_class = dfb.data_entry_form_class
        return self._data_entry_form_class
    
    def sync_db(self):
        mcb = ModelClassBuilder(self)
        mcb.sync_db()
    
    def __unicode__(self):
        return '%s - %s (%s)' % (self.id, self.name, self.table_name)
    
    def get_next_record(self, unverified_only=False, last_id=None):
        q = self.TableModel.objects.filter(snippet__is_blank=False)
        if unverified_only:
            q = q.filter(manually_reviewed=False)
        if last_id is not None:
            q = q.filter(id__gt=last_id)
        q = q.order_by('id', )
        if len(q) > 0:
            return q[0]
        
    def get_fields(self, ordering='ordering', print_only=False):
        q = Field.objects.filter(form=self)
        if print_only:
            q = q.filter(is_printable=True)
        return q.order_by(ordering,)
        
    def get_model_class(self):
        from localground.prints.dynamic import ModelClassBuilder
        mcb = ModelClassBuilder(self)
        return mcb.model_class
    
    @staticmethod     
    def create_new_form(dictionary, user):
        from django.db import connection, transaction
        from localground.lib import generic
        r = dictionary
        ids, alias_dict, type_dict, width_dict = [],{},{},{}
        total_width = 0
        table_name = 'table_%s_%s' % (user.username, generic.generateID(num_digits=10))
            
        for k, v in r.items():
            #build alias dictionary
            if k.find('alias_') != -1:
                #only add ids once:
                id = int(k.split('_')[1])
                ids.append(id)
                alias_dict.update({ id: v })
            
            #build types dictionary
            if k.find('type_') != -1:
                id = int(k.split('_')[1])
                type_dict.update({ id: DataType.objects.get(id=int(v)) })
                
            #build widths dictionary
            if k.find('width_') != -1:
                id = int(k.split('_')[1])
                w = int(float(v))
                total_width = total_width + w
                width_dict.update({ id: w })
                
        if len(ids) == 0:
            return None
        differential = 100 - total_width
        #ensure that total width is 100%:
        width_dict[max(ids)] = width_dict.get(max(ids)) + differential
        ids = sorted(ids)
        
        form_name = r.get('form_name', 'Untitled Form')
        
        #create new form entry
        form = Form()
        form.name = form_name
        form.table_name = table_name
        form.owner = user
        form.save()
        
        #create form field entries:
        for id in ids:
            #alias_dict, type_dict, width_dict
            if id != 0:
                field = Field()
                field.form = form
                field.col_name = 'col_' + str(id)
                field.col_alias = alias_dict.get(id)
                field.data_type = type_dict.get(id)
                field.display_width = width_dict.get(id) #percentage
                field.ordering = id
                field.is_printable = True
                field.has_snippet_field = True
                field.save()
         
        form.sync_db()
        return form
    
    def get_num_field(self):
        dummy_num_field = Field()
        dummy_num_field.has_snippet_field = True
        dummy_num_field.col_name = 'num'
        dummy_num_field.ordering = 0
        return dummy_num_field
  
    def get_snipped_field_names(self):
        names = ['num']
        for n in self.get_fields():
            names.append(n.col_name)
        return names
    
    def get_data_query(self, project=None, marker=None, identity=None, is_blank=False,
                    to_dict=False, include_markers=True, has_geometry=None,
                    attachment=None, manually_reviewed=None):
        # We want to query everything in one go, so we're taking advantage of
        # the "select_related" functionality (no lazy queries please!)
        related_fields = ['source_marker', 'snippet', 'num_snippet', 'project',
                          'snippet__source_attachment', 'owner']
                    #'attachment', 'owner']
        for f in self.get_fields():
            related_fields.append(f.col_name + '_snippet')
        objects =  (self.TableModel.objects
                        .select_related(*related_fields)
                        .distinct()
                        .filter(Q(snippet__is_blank=is_blank) | Q(snippet__isnull=True)))
                       #.filter(snippet__is_blank=is_blank))
        
        if project is not None:
            objects = objects.filter(project=project)
        if marker is not None:
            objects = objects.filter(source_marker=marker)
        if attachment is not None:
            objects = objects.filter(snippet__source_attachment=attachment)
        if manually_reviewed is not None:
            objects = objects.filter(manually_reviewed=manually_reviewed)   
        if identity is not None:
            objects = objects.filter(
                    #Q(owner=identity) |
                    Q(project__owner=identity) |
                    Q(project__users__user=identity)
                )
        if has_geometry:
            objects = objects.filter(point__isnull=False)
        return objects
        
        
    def get_data(self, to_dict=False, include_attachment=False,
                 order_by=['time_stamp'], include_scan=False, **kwargs):
        objects = self.get_data_query(**kwargs)  
        objects = objects.order_by(*order_by)
        
        if to_dict:
            return [
                o.to_dict(include_data=True,
                          include_attachment=include_attachment,
                          include_scan=include_scan, **kwargs
                          )
                for o in list(objects[:2000])
            ]
        return objects
    
    def to_dict(self, print_only=True):
        return dict(
            id=self.id,
            name=self.name,
            columns=[f.to_dict() for f in self.get_fields(print_only=print_only)]
        )
    
    @transaction.commit_manually
    def add_records_batch(self, list_of_dictionaries, user):
        total_num = 0
        batch_num = 500
        counter = 0
        fields = self.get_fields()
        for d in list_of_dictionaries:
            self.add_record(d, user, fields=fields)
            counter+=1
            if counter == batch_num:
                total_num += batch_num
                print('Committing the next %s records...' % batch_num)
                transaction.commit()
                print('Committed %s records total.' % total_num)
                counter = 0
        print('Committing the next %s records...' % batch_num)
        transaction.commit()
        print('Committed %s records total.' % total_num)
    
    def add_record(self, dictionary, user, fields=None):
        d = dictionary
        e = self.TableModel()
        if fields is None:
            print('querying for fields...')
            fields = self.get_fields()
        
        #populate content that exists for all dynamic tables:
        e.snippet = d.get('snippet')
        e.project = d.get('project')
        e.source_marker = d.get('marker')
        e.num = d.get('num')
        e.num_snippet = d.get('num_snippet')
        e.time_stamp = datetime.now()
        e.owner = user
        e.point = d.get('point')
        e.scan = d.get('scan')
        e.last_updated_by = d.get('last_updated_by')
        
        #populate ad hoc columns (variable across tables):
        for n in fields:
            e.__setattr__(n.col_name, d.get(n.col_name))
            e.__setattr__('%s_snippet' % n.col_name, d.get('%s_snippet' % n.col_name))
        e.save()
        self.projects.add(e.project)
        self.save()
        return e
    
    def update_record(self, dictionary, user):
        d = dictionary
        e = self.TableModel.objects.get(id=int(d.get('id')))
        for k, v in d.items():
            e.__setattr__(k, v)
        e.save()
    
    def delete_record(self, id, user):
        self._delete_records([self.TableModel.objects.get(id=id)])
        
    def delete_records_by_ids(self, id_list, user):
        num_deletes = 0
        if len(id_list) > 0:
            objects = list(self.TableModel.objects.filter(id__in=id_list))
            num_deletes = self._delete_records(objects)
        return '%s records were deleted from the %s table.' % (num_deletes, self.name)
        
    def update_blank_status(self, id_list, user, blank_status):
        from django.forms.models import model_to_dict
        if len(id_list) > 0:
            recs = self.TableModel.objects.filter(id__in=id_list)
            snippet_ids = []
            for r in recs:
                # for each record, there are a number of snippet references.  Find
                # them so they can be update to blank / not blank:
                d = model_to_dict(r)
                for key, value in d.iteritems():
                    if key.find('snippet') != -1 and value is not None:
                        snippet_ids.append(value)
            Snippet.objects.filter(id__in=snippet_ids).update(is_blank=blank_status)
            return '%s records were updated from the %s table.' % (len(recs), self.name)
        return '0 records were deleted from the %s table.' % self.name
    
    def delete_record_by_snippet_id(self, snippet_id, user):
        num_deletes = 0
        if attachment_id is not None:
            try:
                objects = [self.TableModel.objects.get(snippet__id=snippet_id)]
                num_deletes = self._delete_records(objects)
            except self.TableModel.DoesNotExist:
                return 'A record corresponding to Snippet #%s in the %s table \
                    does not exist.' % (snippet_id, self.name)
        return '%s records were deleted from the %s table.' % (num_deletes, self.name)
        
        
    def delete_records_by_attachment_id(self, attachment_id, user):
        num_deletes = 0
        if attachment_id is not None:
            objects = list(self.TableModel.objects
                           .filter(snippet__source_attachment__id=attachment_id))
            num_deletes = self._delete_records(objects)    
        return '%s records were deleted from the %s table.' % (num_deletes, self.name)
        
    def _delete_records(self, records):
        from django.forms.models import model_to_dict
        num_deletes, snippet_ids = 0, []
        for r in records:
            # for each record, there are a number of snippet references.  Find
            # them so they can be deleted!
            d = model_to_dict(r)
            for key, value in d.iteritems():
                if key.find('_snippet') != -1 and value is not None:
                    snippet_ids.append(value)
            r.delete()
            num_deletes = num_deletes+1
        Snippet.objects.filter(id__in=snippet_ids).delete()
        return num_deletes
    
    @staticmethod
    def _old_sql(form, table_name, ids):
        sql = '''CREATE TABLE %(table_name)s
        (
          id serial NOT NULL,
          user_num integer,
          user_num_snippet_id integer, ''' % dict(table_name=table_name)   
        for id in ids:
            if id != 0:
                sql += '''
                col_%(id)s %(sql)s, 
                col_%(id)s_snippet_id integer, 
                CONSTRAINT %(table_name)s_col_%(id)s_snippet_id_fkey
                        FOREIGN KEY (col_%(id)s_snippet_id)
                        REFERENCES uploads_snippet (id) MATCH SIMPLE, ''' % \
                            dict(
                                table_name=table_name,
                                id=id,
                                sql=type_dict.get(id).sql
                            ) 
        sql += '''
            time_stamp timestamp with time zone NOT NULL,
              user_id integer,
              project_id integer,
              snippet_id integer,
              marker_id integer,
              scan_id integer,
              point geometry,
              manually_reviewed boolean NOT NULL DEFAULT false,
              CONSTRAINT %(table_name)s_pkey PRIMARY KEY (id),
              CONSTRAINT %(table_name)s_user_id_fkey FOREIGN KEY (user_id)
                  REFERENCES auth_user (id) MATCH SIMPLE,
              CONSTRAINT %(table_name)s_project_id_fkey FOREIGN KEY (project_id)
                  REFERENCES account_project (id) MATCH SIMPLE,
              CONSTRAINT %(table_name)s_snippet_id_fkey FOREIGN KEY (snippet_id)
                  REFERENCES uploads_snippet (id) MATCH SIMPLE,
              CONSTRAINT %(table_name)s_user_num_snippet_id_fkey FOREIGN KEY (user_num_snippet_id)
                  REFERENCES uploads_snippet (id) MATCH SIMPLE,
              CONSTRAINT %(table_name)s_marker_id_fkey FOREIGN KEY (marker_id)
                  REFERENCES overlays_marker (id) MATCH SIMPLE,
              CONSTRAINT %(table_name)s_scan_id_fkey FOREIGN KEY (scan_id)
                  REFERENCES uploads_scan (id) MATCH SIMPLE,
              CONSTRAINT enforce_dims_point CHECK (st_ndims(point) = 2),
              CONSTRAINT enforce_geotype_point CHECK (geometrytype(point) = 'POINT'::text OR point IS NULL),
              CONSTRAINT enforce_srid_point CHECK (st_srid(point) = 4326)
            )
            WITH (
              OIDS=FALSE
            );
            CREATE TRIGGER %(table_name)s_timestamp
                BEFORE UPDATE OR INSERT
                ON %(table_name)s
                FOR EACH ROW
                EXECUTE PROCEDURE update_timestamp();''' % dict(table_name=table_name)
        cursor = connection.cursor()
        cursor.execute(sql)
        transaction.commit_unless_managed()
    
    
    
