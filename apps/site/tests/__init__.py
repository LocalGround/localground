from django import test
from django.core.urlresolvers import resolve
from rest_framework import status
from localground.apps.site import models
from django.contrib.auth.models import User

class Client(test.Client):
	'''
	Extended Client to support PATCH method based on this code discussion:
	https://code.djangoproject.com/ticket/17797
	'''
	def patch(self, path, data='', content_type='application/octet-stream',
			follow=False, **extra):
		"""
		Send a resource to the server using PATCH.
		"""
		response = self.generic('PATCH', path, data=data,
								content_type=content_type, **extra)
		if follow:
			response = self._handle_redirects(response, **extra)
		return response
	
	
class ModelMixin(object):
	user_password = 'top_secret'
	fixtures = ['initial_data.json', 'test_data.json']
	
	class Meta:
		anstract = True
	
	def setUp(self):
		self._user = None
		self._project = None
		self._csrf_token = None
		self.client = self._get_client()
	
	@property  
	def user(self):
		if self._user is None:
			self._user = self.get_user()
		return self._user
	
	@property  
	def project(self):
		if self._project is None:
			self._project = self.get_project()
		return self._project
	
	@property  
	def csrf_token(self):
		if self._csrf_token is None:
			c = Client()
			response = c.get('/accounts/login/')
			self._csrf_token = unicode(response.context['csrf_token'])
		return self._csrf_token
		
	def _get_client(self):
		c = Client(enforce_csrf_checks=True)
		c.login(username='tester', password=self.user_password)
		c.cookies['csrftoken'] = self.csrf_token
		return c
	
	def create_user(self, username='tester'):
		return User.objects.create_user(username,
			first_name='test', email='', password=self.user_password
		)
	
	def get_user(self, user_id=1):
		return User.objects.get(id=user_id)

	def create_project(self, user):
		p = models.Project(
			name='Test Project',
			owner=user,
			last_updated_by=user,
			access_authority=models.ObjectAuthority.objects.get(id=1)
		)
		p.save()
		return p
	
	def get_project(self, project_id=1):
		return models.Project.objects.get(id=project_id)
	
	def create_marker(self, user, project):
		from django.contrib.gis.geos import Point
		#create a marker:
		lat = 37.8705
		lng = -122.2819
		m = models.Marker(
			project=project,
			owner=user,
			color='CCCCCC',
			last_updated_by=user,
			point=Point(lng, lat, srid=4326)
		)
		m.save()
		return m
	
	def get_marker(self, marker_id=1):
		return models.Marker.objects.get(id=marker_id)
	
	def create_print(self, layout_id=1, map_provider=1,
					 lat=55, lng=61.4, zoom=17,
					 map_title='A title',
					 instructions='A description'):
		from django.contrib.gis.geos import Point
		p = models.Print.insert_print_record(
			self.user,
			self.project,
			models.Layout.objects.get(id=layout_id),
			models.WMSOverlay.objects.get(id=map_provider),
			zoom,
			Point(lng, lat, srid=4326),
			'http://localground.stage',
			map_title=map_title,
			instructions=instructions,
			form=None,
			layer_ids=None,
			scan_ids=None
		)
		p.generate_pdf(has_extra_form_page=False)
		return p
	
	def create_form(self, name='A title',
					 description='A description'):
		from django.contrib.gis.geos import Point
		f = models.Form(
			owner=self.user,
			name=name,
			description=description,
			last_updated_by=self.user,
			project=self.project
		)
		f.save()
		return f
	
	def create_form_with_fields(self, name='A title',
					 description='A description', num_fields=2):
		f = self.create_form(name, description)
		for i in range(0, num_fields):
			# add 2 fields to form:
			fld = models.Field(col_alias='Field %s' % (i+1), 
				data_type=models.DataType.objects.get(id=(i+1)),
				display_width=10,
				ordering=1,
				form=f
			)	
			fld.save(user=self.user)
		return f
		
	
	
	def create_imageopt(self, scan):
		p = scan.source_print
		img = models.ImageOpts(
			source_scan=scan,
			file_name_orig='some_file_name.png',
			host=scan.host,
			virtual_path=scan.virtual_path,
			extents=p.extents,
			zoom=p.zoom,
			northeast=p.northeast,
			southwest=p.southwest,
			center=p.center
		)
		img.save(user=scan.owner)
		return img
	
	
	def create_scan(self, user, project):
		p = self.create_print(map_title='A scan-linked print')
		scan = models.Scan(
			project=project,
			owner=user,
			last_updated_by=user,
			source_print=p,
			name='Scan Name',
			description='Scan Description',
			status=models.StatusCode.get_status(models.StatusCode.PROCESSED_SUCCESSFULLY),
			upload_source=models.UploadSource.get_source(models.UploadSource.WEB_FORM)
		)
		scan.save()
		scan.processed_image = self.create_imageopt(scan)
		scan.save()
		return scan

class ViewMixin(ModelMixin):
	fixtures = ['initial_data.json', 'test_data.json']
	
	def setUp(self):
		ModelMixin.setUp(self)
	
	def test_page_403_or_302_status_anonymous_user(self, urls=None):
		if urls is None:
			urls = self.urls
		c = Client() #don't use credentialed client
		for url in urls:
			response = c.get(url)
			self.assertIn(response.status_code, [
				status.HTTP_302_FOUND,
				status.HTTP_403_FORBIDDEN
			])
	
	def test_page_200_status_basic_user(self, urls=None, **kwargs):
		if urls is None:
			urls = self.urls
		for url in urls:
			response = self.client.get(url)
			self.assertEqual(response.status_code, status.HTTP_200_OK)
		
	def test_page_resolves_to_view(self, urls=None):
		if urls is None:
			urls = self.urls
		for url in urls:
			func = resolve(url).func
			func_name = '{}.{}'.format(func.__module__, func.__name__)
			view_name = '{}.{}'.format(self.view.__module__, self.view.__name__)
			#print url, func_name, view_name
			self.assertEqual(func_name, view_name)
	

from localground.apps.site.api.tests import *
from localground.apps.site.tests.views import *