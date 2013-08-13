from django.contrib.gis.db import models
from localground.apps.site.models import BaseAudit
from datetime import datetime
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
	
class Field(BaseAudit):
	form = models.ForeignKey('Form')
	col_name = models.CharField(max_length=255)
	col_alias = models.CharField(max_length=255, verbose_name="column name")
	data_type = models.ForeignKey('DataType')
	display_width = models.IntegerField() #percentage
	
	#field to be displayed in viewer
	is_display_field = models.BooleanField(default=False)
	is_printable = models.BooleanField(default=True)
	has_snippet_field = models.BooleanField(default=True)
	
	#how the fields should be ordered in the data entry form:
	ordering = models.IntegerField()
	
	def to_dict(self):
		return dict(alias=self.col_alias, width_pct=self.display_width)
	
	class Meta:
		app_label = 'site'
		verbose_name = 'field'
		verbose_name_plural = 'fields'
		ordering = ['form__id', 'ordering']
		unique_together = (('col_alias', 'form'), ('col_name', 'form'))
		
	def save(self, user, *args, **kwargs):
		is_new = self.pk is None
		
		# 1. ensure that user doesn't inadvertently change the data type of the column    
		if not is_new:
			o = Field.objects.get(id=self.pk)
			if o.data_type != self.data_type:
				raise Exception('You are not allowed to change the column type of an existing column')              
		else:
			self.owner = user
			self.date_created = get_timestamp_no_milliseconds()
			self.col_name = 'col_placeholder'
		self.last_updated_by = user 
		self.time_stamp = get_timestamp_no_milliseconds()    
		super(Field, self).save(*args, **kwargs)
		
		# 2. ensure that the column name is unique, and add column to table:
		if is_new:
			self.col_name = 'col_%s' % self.pk
			super(Field, self).save(*args, **kwargs)
			self.add_column_to_table()
	
	def add_column_to_table(self):
		if self.form.source_table_exists():
			from django.db import connection, transaction, DatabaseError
			from localground.apps.site.models import Snippet
			cursor = connection.cursor()
			try:
				#if no error thrown, then the column exists.  Do nothing.
				cursor.execute('select %s from %s' % (self.col_name, self.form.table_name))
			except DatabaseError:
				# alter the table and create (1) the column, (2) the corresponding
				# snippet placeholder, and (3) the constraint:
				transaction.rollback_unless_managed()
				errors_encountered = False
				sql = []
				sql.append(
					'ALTER TABLE %s ADD COLUMN %s %s' %
					(self.form.table_name, self.col_name, self.data_type.sql)
				)
				#if self.has_snippet_field:
				sql.append(
					'ALTER TABLE %s ADD COLUMN %s_snippet_id integer' %
					(self.form.table_name, self.col_name)
				)
				sql.append('''
					ALTER TABLE %(table_name)s ADD CONSTRAINT %(table_name)s_%(column_name)s_fkey
					FOREIGN KEY(%(column_name)s)
					REFERENCES %(snippet_table)s(id) MATCH SIMPLE
					''' % dict(
							table_name=self.form.table_name,
							column_name='%s_snippet_id' % self.col_name,
							snippet_table=Snippet._meta.db_table
						)
				)
				for statement in sql:
					cursor.execute(statement)
				transaction.commit_unless_managed()
	
			
