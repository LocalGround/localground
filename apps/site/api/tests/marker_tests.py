from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
from rest_framework import status
			
class ApiMarkerListTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.urls =  ['/api/0/markers/']
		self.view = views.MarkerList.as_view()
		
	def test_create_marker_point_line_poly_using_post(self, **kwargs):
		import json
		for i, url in enumerate(self.urls):
			name, description, color = 'New Marker 1', 'Test description1', 'FF0000'
			geom_types = {
				'Point': '{"type": "Point", "coordinates": [12.492324113849, 41.890307434153]}',
				'LineString': '{"type": "LineString", "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]}',
				'Polygon': '{"type": "Polygon", "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]]}'
			}
			for k in geom_types.keys():
				response = self.client_user.post(url,
					data=urllib.urlencode({
						'geometry': geom_types.get(k),
						'name': name,
						'description': description,
						'color': color,
						'project_id': self.project.id
					}),
					HTTP_X_CSRFTOKEN=self.csrf_token,
					content_type = "application/x-www-form-urlencoded"
				)
				self.assertEqual(response.status_code, status.HTTP_201_CREATED)
				new_marker = models.Marker.objects.all().order_by('-id',)[0]
				self.assertEqual(new_marker.name, name)
				self.assertEqual(new_marker.description, description)
				self.assertEqual(new_marker.color, color)
				self.assertEqual(json.loads(new_marker.geometry.geojson), json.loads(geom_types.get(k)))
				self.assertEqual(k, new_marker.geometry.geom_type)
				self.assertEqual(new_marker.project.id, self.project.id)

class ApiMarkerInstanceTest(test.TestCase, ViewMixinAPI):
	
	def setUp(self):
		ViewMixinAPI.setUp(self)
		self.marker = self.get_marker()
		self.urls = ['/api/0/markers/%s/' % self.marker.id]
		self.view = views.MarkerInstance.as_view()
		
	def test_update_marker_using_put(self, **kwargs):
		for i, url in enumerate(self.urls):
			lat, lng, name, description, color = 54.16, 60.4, 'New Marker Name', \
								'Test description', 'FF0000'
			response = self.client_user.put(url,
				data=urllib.urlencode({
					'lat': lat,
					'lng': lng,
					'name': name,
					'description': description,
					'color': color
				}),
				HTTP_X_CSRFTOKEN=self.csrf_token,
				content_type = "application/x-www-form-urlencoded"
			)
			self.assertEqual(response.status_code, status.HTTP_200_OK)
			updated_marker = models.Marker.objects.get(id=self.marker.id)
			self.assertEqual(updated_marker.name, name)
			self.assertEqual(updated_marker.description, description)
			self.assertEqual(updated_marker.color, color)
			self.assertEqual(updated_marker.point.y, lat)
			self.assertEqual(updated_marker.point.x, lng)
			
	def test_update_marker_using_patch(self, **kwargs):
		for i, url in enumerate(self.urls):
			lat, lng = 54.16, 60.4
			response = self.client_user.patch(url,
				data=urllib.urlencode({
					'lat': lat,
					'lng': lng
				}),
				HTTP_X_CSRFTOKEN=self.csrf_token,
				content_type = "application/x-www-form-urlencoded"
			)
			self.assertEqual(response.status_code, status.HTTP_200_OK)
			updated_marker = models.Marker.objects.get(id=self.marker.id)
			self.assertEqual(updated_marker.point.y, lat)
			self.assertEqual(updated_marker.point.x, lng)
			
	def test_delete_marker(self, **kwargs):
		marker_id = self.marker.id
		
		# ensure marker exists:
		models.Marker.objects.get(id=marker_id)
		
		#delete marker:
		response = self.client_user.delete('/api/0/markers/%s/' % marker_id,
			HTTP_X_CSRFTOKEN=self.csrf_token
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		
		# check to make sure it's gone:
		try:
			models.Marker.objects.get(id=marker_id)
			#throw assertion error if marker still in database
			print 'Marker not deleted'
			self.assertEqual(1, 0)
		except models.Marker.DoesNotExist:
			#trigger assertion success if marker is removed
			self.assertEqual(1, 1)
			
			
		