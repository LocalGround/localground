from django.contrib.gis.db import models
from django.db.models import Q 
from localground.apps.site.managers import FormManager
from localground.apps.site.models import Field, ProjectMixin, BaseNamed, Snippet, DataType
from localground.apps.site.dynamic import ModelClassBuilder, DynamicFormBuilder
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction
	
class Form(BaseNamed, ProjectMixin):
	table_name = models.CharField(max_length=255, unique=True)
	objects = FormManager()
	_model_class = None
	_data_entry_form_class = None
	
	class Meta:
		app_label = 'site'
		verbose_name = 'form'
		verbose_name_plural = 'forms'
		
	@classmethod
	def inline_form(cls, user):
		from localground.apps.site.forms import get_inline_form_with_tags
		return get_inline_form_with_tags(cls, user)
	
	@property
	def TableModel(self):
		'''
		if self._model_class is None:
			mcb = ModelClassBuilder(self)
			self._model_class = mcb.model_class
		return self._model_class
		'''
		return ModelClassBuilder(self).model_class
	
	@property
	def DataEntryFormClass(self):
		if self._data_entry_form_class is None:
			dfb = DynamicFormBuilder(self)
			self._data_entry_form_class = dfb.data_entry_form_class
		return self._data_entry_form_class
	
	
	@classmethod
	def filter_fields(cls):
		from localground.apps.lib.helpers import QueryField, FieldTypes
		return [
			QueryField('name', title='Name', operator='like'),
			QueryField('description', title='Description', operator='like'),
			QueryField('tags', title='Tags'),
			QueryField('date_created', id='date_created_after', title='After',
										data_type=FieldTypes.DATE, operator='>='),
			QueryField('date_created', id='date_created_before', title='Before',
										data_type=FieldTypes.DATE, operator='<=')
		]
	
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
		mcb = ModelClassBuilder(self)
		return mcb.model_class
	
	def save(self, user=None, *args, **kwargs):
		from localground.apps.lib.helpers import generic
		is_new = self.pk is None
		
		# 1. ensure that user doesn't inadvertently change the data type of the column    
		if is_new:
			if user and not hasattr(self, 'owner'):
				self.owner = user
			self.date_created = get_timestamp_no_milliseconds()
			self.table_name = 'table_%s_%s' % (self.owner.username, generic.generateID(num_digits=10))
		
		if user:
			self.last_updated_by = user 
		self.time_stamp = get_timestamp_no_milliseconds()    
		super(Form, self).save(*args, **kwargs)
		
		if is_new:
			self.sync_db()
	
	'''
	@staticmethod     
	def create_new_form(dictionary, user):
		from django.db import connection, transaction
		from localground.apps.lib.helpers import generic
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
	'''
	
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
	
	def get_data_query(self, project=None, filter=None, user=None, is_blank=False,
					to_dict=False, has_geometry=None,
					attachment=None, manually_reviewed=None):
		# We want to query everything in one go, so we're taking advantage of
		# the "select_related" functionality (no lazy queries please!)
		related_fields = ['snippet', 'num_snippet', 'project',
						  'snippet__source_attachment', 'owner', 'form', 'form__project__id']
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
		if attachment is not None:
			objects = objects.filter(snippet__source_attachment=attachment)
		if manually_reviewed is not None:
			objects = objects.filter(manually_reviewed=manually_reviewed)   
		if user is not None:
			objects = objects.filter(
					Q(project__owner=user) |
					Q(project__users__user=user)
				)
		if has_geometry:
			objects = objects.filter(point__isnull=False)
		return objects   
	
	def get_objects(self, user, project=None, filter=None,
					manually_reviewed=True, order_by=['time_stamp'], **kwargs):
		objects = self.get_data_query(manually_reviewed=manually_reviewed, **kwargs)  
		objects = objects.order_by(*order_by)
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
		e.num = d.get('num')
		e.num_snippet = d.get('num_snippet')
		e.time_stamp = get_timestamp_no_milliseconds()
		e.owner = user
		e.point = d.get('point')
		e.scan = d.get('scan')
		e.last_updated_by = d.get('last_updated_by')
		
		#populate ad hoc columns (variable across tables):
		for n in fields:
			e.__setattr__(n.col_name, d.get(n.col_name))
			e.__setattr__('%s_snippet' % n.col_name, d.get('%s_snippet' % n.col_name))
		e.save(user=user)
		self.save(user=user)
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
	
	def source_table_exists(self):
		from django.db import connection, transaction
		try:
			table_name = self.table_name
			cursor = connection.cursor()
			cursor.execute('select count(id) from  %s' % table_name)
			#if no error raised then table exists:
			return True
		except Exception:
			# Table doesn't exist
			transaction.rollback_unless_managed()
			return False
	
	def delete(self, destroy_everything=True, **kwargs):
		if destroy_everything:
			#drop the underlying table if it exists:
			if self.source_table_exists():
				from django.db import connection
				cursor = connection.cursor()
				cursor.execute('drop table %s' % self.table_name)
		
		#remove referenced ContentType	
		try:
			from django.contrib.contenttypes.models import ContentType
			ct = ContentType.objects.get(name='form_%s' % self.id)
			ct.delete()
		except ContentType.DoesNotExist:
			pass
		
		super(Form, self).delete(**kwargs)
	
	
	
	