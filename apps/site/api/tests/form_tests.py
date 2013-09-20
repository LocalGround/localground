from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
from rest_framework import status
from localground.apps.lib.helpers import get_timestamp_no_milliseconds

class ApiFormListTest(test.TestCase, ViewMixinAPI):
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.urls =  ['/api/0/forms/']
		self.view = views.FormList.as_view()	

'''
class ApiFormInstanceTest(test.TestCase, ViewMixinAPI):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/api/0/forms/1/', '/api/0/forms/2/', '/api/0/forms/3/']
		self.view = views.FormInstance.as_view()
'''

class FormDataTestMixin(object):
	
	def create_form_post_data(self):
		lat, lng, num, description, color = 54.16, 60.4, 5, \
								'Test description1', 'FF0000'	
		vals = [
			'a different test string', 			#TEXT
			897, 								#INTEGER
			get_timestamp_no_milliseconds(), 	#DATE_TIME
			True, 								#BOOL
			4.5, 								#DECIMAL
			10 									#RATING
		]
		d = {
			'lat': lat,
			'lng': lng,
			'num': num,
			'project_id': self.project.id
		}
		#add dynamic form values:
		fields = self.form.get_fields()
		for i, field in enumerate(fields):
			d[field.col_name] = vals[i]
		return d

	def verify_success(self, d):
		rec = self.form.TableModel.objects.all().order_by('-id',)[0]
		self.assertEqual(rec.point.y, d.get('lat'))
		self.assertEqual(rec.point.x, d.get('lng'))
		self.assertEqual(rec.num, d.get('num'))
		fields = self.form.get_fields()
		for i in range(0, 5):
			self.assertEqual(d.get(fields[i].col_name), getattr(rec, fields[i].col_name))

class ApiFormDataListTest(test.TestCase, FormDataTestMixin, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.form = self.create_form_with_fields(name="Class Form", num_fields=6)
		self.url = '/api/0/forms/%s/data/' % self.form.id
		self.urls = [self.url]
		self.view = views.FormDataList.as_view()
		
	def test_create_record_using_post(self, **kwargs):
		
		#create post data:
		d = FormDataTestMixin.create_form_post_data(self)
		#print d
		
		#post:
		response = self.client_user.post(self.url,
			data=urllib.urlencode(d),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		
		#verify values:
		FormDataTestMixin.verify_success(self, d)

'''
# Not working, so commented out for now until I have more time...
class ApiFormDataInstanceTest(test.TestCase, FormDataTestMixin, ViewMixin):
	
	def setUp(self):
		ViewMixin.setUp(self)
		self.form = self.create_form_with_fields(name="Class Form", num_fields=6)
		#requery:
		self.form = models.Form.objects.get(id=self.form.id)
		self.rec_1 = self.insert_form_data_record(form=self.form)
		self.assertEqual(len(self.form.TableModel.objects.all()), 1)
		records = self.form.TableModel.objects.all()
		print records[0].id, records[0].point.x
		raw_input('pausing')
		self.url = '/api/0/forms/%s/data/%s/' % (self.form.id, self.rec_1.id)
		self.urls = [self.url]
		self.view = views.FormDataInstance.as_view()
		
	#def tearDown(self, ):
	#	self.form.delete()

	
	def test_update_record_using_put(self, **kwargs):
		print 'posting to:', self.url
		d = FormDataTestMixin.create_form_post_data(self)
		response = self.client_user.put(self.url,
			data=urllib.urlencode(d),
			HTTP_X_CSRFTOKEN=self.csrf_token,
			content_type = "application/x-www-form-urlencoded"
		)
		FormDataTestMixin.verify_success(self, d)
'''	

