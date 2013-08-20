from django import test
from localground.apps.site.views import forms
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin, ModelMixin
from rest_framework import status
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
import urllib
		
class UpdateFormTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.form = self.create_form(name="Class Form")
		self.urls = [
			'/profile/forms/%s/' % self.form.id,
			'/profile/forms/%s/embed/' % self.form.id,
			'/profile/forms/create/',
			'/profile/forms/create/embed/'
		]
		self.view = forms.create_update_form
		
	def test_add_fields_to_existing_form(self, **kwargs):
		from localground.apps.site import models
		
		# add 2 fields to form:
		f1 = models.Field(col_alias='Field 1', 
			data_type=models.DataType.objects.get(id=1),
			display_width=10,
			ordering=1,
			form=self.form
		)
		f1.save(user=self.user)
		
		# add second field to form:
		f2 = models.Field(col_alias='Field 2', 
			data_type=models.DataType.objects.get(id=1),
			display_width=10,
			ordering=2,
			form=self.form
		)
		f2.save(user=self.user)
		
		self.assertEqual(2, len(self.form.get_fields()))
		
		# query the new form:
		self.assertEqual(len(self.form.get_data()), 0)
		
		#requery:
		form = models.Form.objects.get(id=self.form.id)
		
		#insert a record
		timestamp = get_timestamp_no_milliseconds()
		record = form.TableModel()
		record.num = 1
		record.owner = self.user
		setattr(record, f1.col_name, 'Column Value 1')
		setattr(record, f2.col_name, 'Column Value 2')
		record.save(user=self.user)
		
		form = models.Form.objects.get(id=self.form.id)
		rec = form.get_data().all()[0]
		self.assertEqual('Column Value 1', getattr(rec, f1.col_name))
		self.assertEqual('Column Value 2', getattr(rec, f2.col_name))
		self.assertIsNotNone(rec.time_stamp)
		self.assertIsNotNone(rec.date_created)
		self.assertEqual(self.user, rec.owner)
		self.assertEqual(self.user, rec.last_updated_by)
		self.assertEqual(1, rec.num)
		
	def make_post_dictionary(self, name, description, tags):
		# add 2 fields:
		data = {
			'name': name,
			'description': description,
			'tags': tags,
			'field-0-col_alias': 'my first column',
			'field-0-data_type': 1,
			'field-0-is_printable': 'on',
			'field-0-is_display_field': 'on',
			'field-1-col_alias': 'my second column',
			'field-1-data_type': 6,
			'field-1-is_printable': 'on',
		}
		management_form = {
			'field-TOTAL_FORMS': 2,
			'field-INITIAL_FORMS': 0,
			'field-MAX_NUM_FORMS': 1000
		}
		data.update(management_form)
		return data
	
	
	def test_add_fields_to_existing_form_using_view(self, **kwargs):
		from localground.apps.site.models import Field
		
		name = 'new name'
		description = 'new d'
		tags = 'a, b, c'
		project = self.project.id
		
		
		data = self.make_post_dictionary(name, description, tags)
		data.update({'project': project})
		
		# form should not have any fields:
		self.assertEqual(len(self.form.get_fields()), 0)
		
		response = self.client.post(self.urls[0],
			data=urllib.urlencode(data),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		
		#successfully redirected
		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		
		# re-query 
		form = models.Form.objects.get(id=self.form.id)
		
		
		# form data should be changed
		self.assertEqual(form.name, name)
		self.assertEqual(form.description, description)
		self.assertEqual(form.tags, tags)
		
		# form should have 2 fields:
		fields = form.get_fields()
		self.assertEqual(len(fields), 2)

		
		from django.db import connection, transaction
		cursor = connection.cursor()
		
		# there should be a new table created with both fields present:
		for field in fields:
			#if an exception isn't thrown, it works
			a = cursor.execute('select %s from %s' % (field.col_name, field.form.table_name))		
		
		
	
		
	def test_add_new_form_using_view(self, **kwargs):
		from localground.apps.site.models import Field, Form
		
		name = 'brand new form!'
		description = 'new d'
		tags = 'a, b, c'
		project = self.project.id
		
		
		data = self.make_post_dictionary(name, description, tags)
		data.update({'project': project})
		
		response = self.client.post('/profile/forms/create/',
			data=urllib.urlencode(data),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		
		#successfully redirected
		self.assertEqual(response.status_code, status.HTTP_302_FOUND)
		
		# re-query 
		form = models.Form.objects.get(name=name)
		
		
		# form data should be changed
		self.assertEqual(form.description, description)
		self.assertEqual(form.tags, tags)
		
		# form should have 2 fields:
		fields = form.get_fields()
		self.assertEqual(len(fields), 2)

		
		from django.db import connection, transaction
		cursor = connection.cursor()
		
		# there should be a new table created with both fields present:
		for field in fields:
			#if an exception isn't thrown, it works
			a = cursor.execute('select %s from %s' % (field.col_name, field.form.table_name))		
		
		