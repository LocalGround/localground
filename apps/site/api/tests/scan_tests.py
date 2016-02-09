from django import test
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import views
from rest_framework import status
from localground.apps.site.api.tests.base_tests import ViewMixinAPI

def get_metadata():
    return {
        'east': {'read_only': True, 'required': False, 'type': 'field'},
        'north': {'read_only': True, 'required': False, 'type': 'field'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'media_file': { 'type': 'string', 'required': True, 'read_only': False },
        'file_path': {'type': 'field', 'required': False, 'read_only': True},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'west': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'zoom': {'read_only': True, 'required': False, 'type': 'field'},
        'source_print': {'read_only': False, 'required': False, 'type': 'field'},
        'overlay_path': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'south': {'read_only': True, 'required': False, 'type': 'field'},
        'name': {'read_only': False, 'required': False, 'type': 'string'}
    }
class ApiScanListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/map-images/']
        self.view = views.ScanList.as_view()
        self.metadata = get_metadata()

    def test_create_scan_using_post(self, **kwargs):
        import Image, tempfile
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        with open(tmp_file.name, 'rb') as data:
            response = self.client_user.post(self.urls[0],
                                             {'project_id': self.project.id,
                                              'media_file' : data},
                                             HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            # a few more checks to make sure that file paths are being
            # generated correctly:
            new_object = models.Scan.objects.get(id=response.data.get("id"))
            file_name = tmp_file.name.split("/")[-1]
            file_name = unicode(file_name, "utf-8")
            path = new_object.encrypt_url(new_object.file_name_new)
            self.assertEqual(file_name, new_object.name)
            self.assertEqual(new_object.status.id, 3)
            self.assertEqual(file_name, new_object.file_name_orig)
            self.assertTrue(len(new_object.file_name_new) > 5) #ensure not empty
            self.assertEqual(settings.SERVER_HOST, new_object.host)
            self.assertNotEqual(path.find('/profile/map-images/'), -1)
            self.assertNotEqual(path.find(new_object.host), -1)
            self.assertTrue(len(path.split('/')[-2]) > 40)

class ApiScanDetailTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.scan = self.create_scan(self.user, self.project)
        self.urls = ['/api/0/map-images/%s/' % self.scan.id]
        self.view = views.ScanInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({"media_file": { "type": "string", "required": False, "read_only": True }})

