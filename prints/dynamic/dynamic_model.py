from localground.lib.models import PointObject
from django.contrib.gis.db import models
from datetime import datetime

class ModelClassBuilder(object):
    def __init__(self, form):
        self.name = 'TableModel'
        self.form = form
        self.dynamic_field_descriptors = form.get_fields()
        self.app_label = 'prints_%s' % form.table_name   #needs to be unique
        self.module = 'prints.form.%s' % form.table_name      #needs to be unique
        self.options = options = {
            'ordering': ['num'],
            'verbose_name': 'table',
            'verbose_name': 'tables',
            'db_table': form.table_name
        }
        self.fields = {}
        self.dynamic_fields = {}
        self.snippet_fields = {}
        self._model_class = None
     
    @property
    def model_class(self):
        if self._model_class is None:
            if len(self.fields.items()) == 0:
                self.define_model_fields_from_descriptors()
            
            class ModelClassBuilder:
                pass
        
            if self.app_label:
                # app_label must be set using the Meta inner class
                setattr(ModelClassBuilder, 'app_label', self.app_label)
        
            # Update Meta with any options that were provided
            if self.options is not None:
                for key, value in self.options.iteritems():
                    setattr(ModelClassBuilder, key, value)
        
            # Set up a dictionary to simulate declarations within a class
            attrs = {'__module__': self.module, 'Meta': ModelClassBuilder}
        
            # Add in any fields that were provided
            attrs.update(self.fields)
            
            '''
            -------------------
            Begin Model Methods
            -------------------
            '''
            def get_dynamic_data(self):
                data = []
                for descriptor in self.dynamic_field_descriptors:
                    data.append(self.__getattribute__(descriptor.col_name))
                return data
            
            def get_snippet(self, field_name):
                    return self.__getattribute__(field_name + '_snippet')
                    
            def get_widget(self, field_name):
                return self.__getattribute__(field_name).widget
                
            def get_dynamic_data_default(self):
                data = []
                for descriptor in self.dynamic_field_descriptors:
                    field_transcribed = self.__getattribute__(descriptor.col_name)
                    if descriptor.has_snippet_field:
                        field_image = self.__getattribute__(descriptor.col_name + '_snippet')
                    else:
                        field_image = None
                    if field_transcribed is not None:
                        data.append(field_transcribed)
                    elif field_image is not None and not self.manually_reviewed:
                        data.append('<img src="%s" />' % (field_image.absolute_virtual_path()))
                    else:
                        data.append('--')
                return data
            
            def get_dynamic_data_snippet(self):
                data = []
                for descriptor in self.dynamic_field_descriptors:
                    field_transcribed = self.__getattribute__(descriptor.col_name)
                    if descriptor.has_snippet_field:
                        field_image = self.__getattribute__(descriptor.col_name + '_snippet')
                    else:
                        field_image = None
                    if field_image is not None:
                        data.append('<img src="%s" />' % (field_image.absolute_virtual_path()))
                    else:
                        field_transcribed = self.__getattribute__(descriptor.col_name)
                        if field_transcribed is not None:
                            data.append(field_transcribed)
                        else:
                            data.append('--')
                return data
            
            def get_row_num_default(self):
                if self.num is not None:
                    return self.num
                elif self.num_snippet is not None and not self.manually_reviewed:
                    s = self.num_snippet
                    return '<img src="%s" />' % (s.absolute_virtual_path())
                else:
                    return '--'
            
            def get_row_num_snippet(self):
                if self.num_snippet is not None:
                    s = self.num_snippet
                    return '<img src="%s" />' % (s.absolute_virtual_path())
                else:
                    return '--'
                
            def get_row_num(self):
                if self.num is not None:
                    return self.num
                else:
                    return '--'
            
            def has_field_level_snippets(self):
                return self.num_snippet is not None
            
            
            def to_dict(self, include_project=False, include_marker=True,
                            include_data=False, include_scan=False,
                            include_attachment=False, **kwargs):
                d = dict(
                    form_id=self.form_id,
                    id=self.id,
                    num=self.num,
                    reviewed=self.manually_reviewed  
                )
                if self.snippet is not None:
                    d.update(dict(snippet_url= self.snippet.absolute_virtual_path()))
                if self.point is not None:
                    d.update(dict(lat=self.point.y, lng=self.point.x))
                if include_project:
                    d.update(dict(project=self.project.to_dict()))
                else:
                    d.update(dict(project_id=self.project.id))
                if include_marker and self.source_marker is not None:
                    d.update(dict(marker=dict(id=self.source_marker.id)))
                elif self.source_marker is not None:
                    d.update(dict(markerID=self.source_marker.id)) 
                if include_scan and self.scan is not None:
                    d.update(dict(scan=self.scan.to_dict()))
                if include_attachment and self.snippet is not None \
                    and self.snippet.source_attachment is not None:
                    d.update(dict(attachment={
                        'name': self.snippet.source_attachment.name,
                        'attribution': self.snippet.source_attachment.attribution
                    }))  
                if include_data:
                    data = []
                    #add number field
                    field = dict(
                            col_name='num',
                            col_alias='Number',
                            value=self.num
                        )
                    snippet = self.__getattribute__('num_snippet')
                    if snippet is not None:
                            field.update(dict(
                                snippet_url= snippet.absolute_virtual_path()
                            ))
                    data.append(field)
                    
                    #add the rest of the dynamic content:
                    for descriptor in self.dynamic_field_descriptors:
                        field = dict(
                            col_name=descriptor.col_name,
                            col_alias=descriptor.col_alias,
                            value=self.__getattribute__(descriptor.col_name)
                        )
                        if isinstance(field['value'], datetime):
                            field['value'] = field['value'].strftime('%m/%d/%Y, %I:%M:%S %p')
                        snippet = None
                        if descriptor.has_snippet_field:
                            snippet = self.__getattribute__(descriptor.col_name + '_snippet')
                        if snippet is not None:
                            field.update(dict(
                                snippet_url= snippet.absolute_virtual_path()
                            ))
                        data.append(field)
                        if descriptor.is_display_field:
                            d.update(dict(name=field['value']))
                        else:
                            d.update(dict(name=self.__getattribute__('col_1'))) 
                    d.update(dict(fields=data))
                        
                return d
            
            def to_dict_lite(self, **kwargs):
                d = dict(
                    form_id=self.form_id,
                    id=self.id
                )
                if self.point is not None:
                    d.update(dict(lat=self.point.y, lng=self.point.x))
                if self.source_marker is not None:
                    d.update(dict(markerID=self.source_marker.id)) 
                # add dynamic data:
                data = []
                for descriptor in self.dynamic_field_descriptors:
                    val = self.__getattribute__(descriptor.col_name)
                    if isinstance(val, datetime):
                        val = val.strftime('%m/%d/%Y, %I:%M:%S %p')
                    data.append(val) 
                d.update(dict(fields=data))
                return d
             
            #append methods to class:
            attrs.update(dict(
                form_id=self.form.id,
                dynamic_field_descriptors=self.dynamic_field_descriptors,
                to_dict=to_dict,
                to_dict_lite=to_dict_lite,
                get_snippet=get_snippet,
                get_widget=get_widget,
                get_dynamic_data=get_dynamic_data,
                get_dynamic_data_default=get_dynamic_data_default,
                get_dynamic_data_snippet=get_dynamic_data_snippet,
                get_row_num_default=get_row_num_default,
                get_row_num=get_row_num,
                get_row_num_snippet=get_row_num_snippet,
                has_field_level_snippets=has_field_level_snippets
            ))
        
            # Create the class, which automatically triggers ModelBase processing
            self._model_class = type(self.name, (PointObject, ), attrs)
        
        return self._model_class   
    
        
    def define_model_fields_from_descriptors(self):
        self.fields.update(
            dict(
                num=models.IntegerField(null=True, blank=True, db_column='user_num',
                                           verbose_name='Row Number'),
                num_snippet=models.ForeignKey('uploads.Snippet', null=True, blank=True,
                                                 db_column='user_num_snippet_id'),
                snippet=models.ForeignKey('uploads.Snippet', null=True, blank=True),
                manually_reviewed=models.BooleanField(),
                source_marker=models.ForeignKey('overlays.Marker', null=True,
                                                    db_column='marker_id', blank=True),
                scan=models.ForeignKey('uploads.Scan', null=True, blank=True)
            )
        )
        
        # 2) read field specifications and build dynamic fields:
        # ------------------------------------------------------
        field = None
        for n in self.dynamic_field_descriptors:
            if n.data_type.id == 1:
                field = models.CharField(max_length=1000, blank=True, null=True,
                                         verbose_name=n.col_alias)
            elif n.data_type.id in [2, 6]:
               field = models.IntegerField(null=True, blank=True,
                                           verbose_name=n.col_alias)
            elif n.data_type.id == 3:
                field = models.DateTimeField(null=True, blank=True,
                                             verbose_name=n.col_alias )
            elif n.data_type.id == 4:
                field = models.BooleanField(null=True, blank=True,
                                            verbose_name=n.col_alias)
            elif n.data_type.id == 5:
                field = models.FloatField(null=True, blank=True,
                                          verbose_name=n.col_alias)
            
            #add dynamic field:
            self.dynamic_fields.update({
                n.col_name: field
            })
            if n.has_snippet_field:
                #also add snippet placeholder:
                snippet_field_name = '%s_snippet' % n.col_name
                self.snippet_fields.update({
                    snippet_field_name: models.ForeignKey('uploads.Snippet',
                                                            null=True, blank=True)
                })
        self.fields.update(self.dynamic_fields)
        self.fields.update(self.snippet_fields)

    
    def sync_db(self):
        '''
        This function uses the same code that's used in syncdb to dynamically
        execute DDL sql on-the-fly.  Copied from:
        /usr/local/lib/python2.6/dist-packages/django/core/management/commands/syncdb.py        
        '''
        from django.core.management.color import no_style
        from django.db import connection, transaction
        
        cursor = connection.cursor()
        tables = connection.introspection.table_names()
        seen_models = connection.introspection.installed_models(tables)
        created_models = set()
        pending_references = {}
        
        sql, references = connection.creation.sql_create_model(self.model_class, no_style(), seen_models)
        seen_models.add(self.model_class)
        created_models.add(self.model_class)
        for refto, refs in references.items():
            pending_references.setdefault(refto, []).extend(refs)
            if refto in seen_models:
                sql.extend(connection.creation.sql_for_pending_references(refto, no_style(), pending_references))
        sql.extend(connection.creation.sql_for_pending_references(self.model_class, no_style(), pending_references))
        
        #append point geometry by calling the PostGIS function:
        sql.append("select AddGeometryColumn('public','%s','point',4326,'POINT',2)" % self.form.table_name);
        for statement in sql:
            cursor.execute(statement)
        transaction.commit_unless_managed()
    
