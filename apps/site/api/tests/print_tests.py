from django import test
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.site.api.fields.list_field import convert_tags_to_list

class LayoutMixin(object):
    metadata = {
        'display_name': {'read_only': False, 'required': False, 'type': 'string'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': True, 'type': 'string'}
    }

def get_metadata():
    return {
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'layout': {'read_only': False, 'required': True, 'type': 'field'},
        'uuid': {'read_only': True, 'required': False, 'type': 'field'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'map_provider_url': {'read_only': True, 'required': False, 'type': 'field'},
        'center': {'read_only': False, 'required': True, 'type': 'geojson'},
        'thumb': {'read_only': True, 'required': False, 'type': 'field'},
        'zoom': {'read_only': False, 'required': False, 'type': 'integer'},
        'map_title': {'read_only': False, 'required': False, 'type': 'string'},
        'map_provider': {'read_only': False, 'required': True, 'type': 'field'},
        'pdf': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': True, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'layout_url': {'read_only': True, 'required': False, 'type': 'field'},
        'instructions': {'read_only': False, 'required': False, 'type': 'memo'}
    }

class PrintMixin(object):
    metadata = get_metadata()

class ApiLayoutListTest(test.TestCase, ViewMixinAPI, LayoutMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/layouts/']
        self.view = views.LayoutViewSet.as_view({'get': 'list'})


class ApiLayoutInstanceTest(test.TestCase, ViewMixinAPI, LayoutMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = [
            '/api/0/layouts/1/',
            '/api/0/layouts/2/']
        self.view = views.LayoutViewSet.as_view({'get': 'detail'})


class ApiPrintListTest(test.TestCase, ViewMixinAPI, PrintMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/prints/'
        self.urls = [self.url]
        self.view = views.PrintList.as_view()
        self.point = {
            "type": "Point",
            "coordinates": [12.492324113849, 41.890307434153]
        }

    def test_create_print_using_post(self, **kwargs):
        map_title = 'A Map Title'
        instructions = 'Some instructions.'
        layout = 1
        map_provider = 1
        zoom = 17

        response = self.client_user.post(self.url,
                                         data=urllib.urlencode({
                                             'center': self.point,
                                             'map_title': map_title,
                                             'instructions': instructions,
                                             'layout': layout,
                                             'map_provider': map_provider,
                                             'zoom': zoom,
                                             'project_id': self.project.id
                                         }),
                                         HTTP_X_CSRFTOKEN=self.csrf_token,
                                         content_type="application/x-www-form-urlencoded"
                                         )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_object = (models.Print.objects
                      .select_related('layout', 'map_provider')
                      .all()
                      .order_by('-id',))[0]
        self.assertEqual(new_object.name, map_title)
        self.assertEqual(new_object.host, 'testserver')
        self.assertEqual(new_object.virtual_path, '/userdata/prints/%s/' % new_object.uuid)
        self.assertTrue(len(new_object.uuid), 8)
        self.assertEqual(new_object.description, instructions)
        self.assertEqual(
            new_object.center,
            GEOSGeometry(
                json.dumps(
                    self.point)))
        self.assertEqual(new_object.project.id, self.project.id)
        self.assertEqual(new_object.layout.id, layout)
        self.assertEqual(new_object.map_provider.id, layout)

        # Finally: check to make sure that the URL paths point to
        # actual files (pdf & map image) on the server
        data = response.data
        pdf_response = self.client_user.get(data.get('pdf'))
        self.assertEqual(pdf_response.status_code, status.HTTP_200_OK)
        
        #print data.get('pdf'), pdf_response
        
        
        thumb_response = self.client_user.get(data.get('thumb'))
        self.assertEqual(thumb_response.status_code, status.HTTP_200_OK)
        #print data.get('thumb'), thumb_response
        


class ApiPrintInstanceTest(test.TestCase, ViewMixinAPI, PrintMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.print_object = self.create_print()
        self.url = '/api/0/prints/%s/' % self.print_object.id
        self.urls = [self.url]
        self.view = views.PrintInstance.as_view()
        self.model = models.Print
        self.metadata = get_metadata()
        self.metadata.update({
            'center': {'read_only': True, 'required': False, 'type': 'geojson'},
            'layout': {'read_only': True, 'required': False, 'type': 'field'},
            'map_provider': {'read_only': True, 'required': False, 'type': 'field'}, 
            'project_id': {'read_only': False, 'required': False, 'type': 'field'},
            'zoom': {'read_only': True, 'required': False, 'type': 'integer'},    
        })

    def test_tnt_using_patch(self, **kwargs):
        name, description, tags = 'A', 'B', 'C'
        response = self.client_user.patch(self.url,
                                          data=json.dumps({
                                              'map_title': name,
                                              'instructions': description,
                                              'tags': tags
                                          }),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/json"
                                          )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_obj = self.model.objects.get(id=self.print_object.id)
        self.assertEqual(updated_obj.name, name)
        self.assertEqual(updated_obj.description, description)
        self.assertEqual(updated_obj.tags, convert_tags_to_list(tags))

    def test_update_print_using_put(self, **kwargs):
        name, description, tags = 'A', 'B', 'C'
        response = self.client_user.put(self.url,
                                        data=json.dumps({
                                            'map_title': name,
                                            'instructions': description,
                                            'tags': tags
                                        }),
                                        HTTP_X_CSRFTOKEN=self.csrf_token,
                                        content_type="application/json"
                                        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_obj = self.model.objects.get(id=self.print_object.id)
        self.assertEqual(updated_obj.name, name)
        self.assertEqual(updated_obj.description, description)
        self.assertEqual(updated_obj.tags, convert_tags_to_list(tags))

    def test_delete_print(self, **kwargs):
        print_id = self.print_object.id

        # ensure photo exists:
        self.model.objects.get(id=print_id)

        # delete photo:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            self.model.objects.get(id=print_id)
            # throw assertion error if print still in database
            print 'Print not deleted'
            self.assertEqual(1, 0)
        except self.model.DoesNotExist:
            # trigger assertion success if print is removed
            self.assertEqual(1, 1)
