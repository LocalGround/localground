from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
from rest_framework import status

def get_metadata():
    return {
        'description': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'string'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'slug': {'read_only': False, 'required': True, 'type': 'slug'},
        'access': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
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
                                         data=urllib.urlencode({
                                             'name': name,
                                             'description': description,
                                             'tags': tags,
                                             'slug': slug
                                         }),
                                         HTTP_X_CSRFTOKEN=self.csrf_token,
                                         content_type="application/x-www-form-urlencoded"
                                         )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_obj = self.model.objects.all().order_by('-id',)[0]
        self.assertEqual(new_obj.name, name)
        self.assertEqual(new_obj.description, description)
        self.assertEqual(new_obj.tags, tags)
        self.assertEqual(new_obj.slug, slug)
        
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

    def test_update_project_using_put(self, **kwargs):
        name, description = 'New Project Name', 'Test description'
        response = self.client_user.put(self.url,
                            data=urllib.urlencode({
                                'name': name,
                                'description': description
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
