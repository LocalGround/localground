from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib, json
from rest_framework import status
from localground.apps.site.api.fields.list_field import convert_tags_to_list

def get_metadata():
    return {
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'slug': {'read_only': False, 'required': True, 'type': 'slug'},
        'access_authority': {'read_only': False, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'sharing_url': { 'type': 'field', 'required': False, 'read_only': True }
    }

class ApiProjectListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/projects/'
        self.urls = [self.url]
        self.model = models.Project
        self.view = views.ProjectList.as_view()
        self.metadata = get_metadata()
        
    def tearDown(self):
        models.Form.objects.all().delete()

    def test_create_project_using_post(self, **kwargs):
        name = 'New Project!'
        description = 'New project description'
        tags = "d, e, f"
        slug = 'new-project-123'
        response = self.client_user.post(self.url,
                                         data=json.dumps({
                                             'name': name,
                                             'caption': description,
                                             'tags': tags,
                                             'slug': slug,
                                             'access_authority': 2
                                         }),
                                         HTTP_X_CSRFTOKEN=self.csrf_token,
                                         content_type="application/json"
                                         )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_obj = self.model.objects.all().order_by('-id',)[0]
        self.assertEqual(new_obj.name, name)
        self.assertEqual(new_obj.description, description)
        self.assertEqual(new_obj.tags, convert_tags_to_list(tags))
        self.assertEqual(new_obj.slug, slug)
        self.assertEqual(new_obj.access_authority.id, 2)
        
class ApiProjectInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.url = '/api/0/projects/%s/' % self.project.id
        self.urls = [self.url]
        self.view = views.ProjectInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'children': {'read_only': True, 'required': False, 'type': 'field'},
            'slug': {'read_only': False, 'required': False, 'type': 'slug'}
        })
        
    def _check_children(self, children):
        self.assertTrue(not children is None)
        for k in ['photos', 'audio', 'markers', 'map_images']:
            self.assertTrue(not children.get(k) is None)
            self.assertTrue(isinstance(children.get(k).get('update_metadata'), dict))
            self.assertTrue(isinstance(children.get(k).get('overlay_type'), basestring))
            self.assertTrue(isinstance(children.get(k).get('data'), list))
            self.assertTrue(isinstance(children.get(k).get('id'), basestring))
            self.assertTrue(isinstance(children.get(k).get('name'), basestring))
        
    def test_get_project_with_marker_counts(self, **kwargs):
        self.create_marker(self.user, self.project)
        response = self.client_user.get(self.url)
        children = response.data.get("children")
        self._check_children(children)
            
        #check counts:
        marker = children.get('markers').get('data')[0]
        self.assertTrue(marker.has_key('photo_count'))
        self.assertTrue(marker.has_key('audio_count'))
        self.assertTrue(marker.has_key('record_count'))
        self.assertTrue(marker.has_key('map_image_count'))
        
    def test_get_project_with_marker_arrays(self, **kwargs):
        self.create_marker(self.user, self.project)
        response = self.client_user.get(self.url, { 'marker_with_media_arrays': 1 })
        children = response.data.get("children")
        self._check_children(children)
            
        #check arrays:
        marker = children.get('markers').get('data')[0]
        self.assertTrue(marker.has_key('photo_array'))
        self.assertTrue(marker.has_key('audio_array'))
        self.assertTrue(marker.has_key('record_array'))
        self.assertTrue(marker.has_key('map_image_array'))

    def test_update_project_using_put(self, **kwargs):
        name, description = 'New Project Name', 'Test description'
        response = self.client_user.put(self.url,
                            data=urllib.urlencode({
                                'name': name,
                                'caption': description
                            }),
                            HTTP_X_CSRFTOKEN=self.csrf_token,
                            content_type="application/x-www-form-urlencoded"
                        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_project = models.Project.objects.get(id=self.project.id)
        self.assertEqual(updated_project.name, name)
        self.assertEqual(updated_project.description, description)

    def test_update_project_using_patch(self, **kwargs):
        import json
        name = 'Dummy name'
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({'name': name}),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_project = models.Project.objects.get(id=self.project.id)
        self.assertEqual(updated_project.name, name)

    def test_delete_project(self, **kwargs):
        project_id = self.project.id
        # ensure project exists:
        models.Project.objects.get(id=project_id)

        # delete project:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Project.objects.get(id=project_id)
            # throw assertion error if project still in database
            print 'Project not deleted'
            self.assertEqual(1, 0)
        except models.Project.DoesNotExist:
            # trigger assertion success if project is removed
            self.assertEqual(1, 1)
