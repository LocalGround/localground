from django import test
from django.conf import settings
from localground.apps.site import models
from localground.apps.site.api import views
from rest_framework import status
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import json, os.path

def get_metadata():
    return {
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'uuid': {'read_only': True, 'required': False, 'type': 'string' },
        'north': {'read_only': True, 'required': False, 'type': 'field'},
        'south': {'read_only': True, 'required': False, 'type': 'field'},
        'east': {'read_only': True, 'required': False, 'type': 'field'},
        'west': {'read_only': True, 'required': False, 'type': 'field'},
        'geometry': {'read_only': True, 'required': False, 'type': 'geojson'},
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'media_file': { 'type': 'string', 'required': True, 'read_only': False },
        'file_path': {'type': 'field', 'required': False, 'read_only': True},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'zoom': {'read_only': True, 'required': False, 'type': 'field'},
        'source_print': {'read_only': False, 'required': False, 'type': 'field'},
        'overlay_path': {'read_only': True, 'required': False, 'type': 'field'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'south': {'read_only': True, 'required': False, 'type': 'field'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'uuid': {'read_only': True, 'required': False, 'type': 'string' },
        'status': {'read_only': True, 'required': False, 'type': 'field' },
        'file_name': {'read_only': True, 'required': False, 'type': 'field'}
    }
class ApiMapImageListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/map-images/']
        self.view = views.MapImageList.as_view()
        self.metadata = get_metadata()

    def test_create_mapimage_using_post(self, **kwargs):
        import Image, tempfile
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        with open(tmp_file.name, 'rb') as data:
            response = self.client_user.post(
                self.urls[0],
                {
                    'project_id': self.project.id,
                    'media_file' : data
                },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            # a few more checks to make sure that file paths are being
            # generated correctly:
            new_object = models.MapImage.objects.get(id=response.data.get("id"))
            file_name = tmp_file.name.split("/")[-1]
            file_name = unicode(file_name, "utf-8")
            path = new_object.encrypt_url(new_object.file_name_new)
            self.assertEqual(file_name, new_object.name)
            self.assertEqual(new_object.status.id, models.StatusCode.READY_FOR_PROCESSING)
            self.assertEqual(len(new_object.uuid), 8)
            self.assertEqual(file_name, new_object.file_name_orig)
            self.assertTrue(len(new_object.file_name_new) > 5) #ensure not empty
            self.assertEqual(settings.SERVER_HOST, new_object.host)
            self.assertNotEqual(path.find('/profile/map-images/'), -1)
            self.assertNotEqual(path.find(new_object.host), -1)
            self.assertTrue(len(path.split('/')[-2]) > 40)
            
            # and also check the file exists in the file system:
            fname = new_object.original_image_filesystem()
            self.assertTrue(fname.find(new_object.uuid) > -1)
            self.assertTrue(os.path.isfile(fname))

class ApiMapImageDetailTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=True)
        self.source_print = self.create_print()
        self.mapimage = self.create_mapimage(self.user, self.project)
        self.url = '/api/0/map-images/%s/' % self.mapimage.id
        self.urls = [self.url]
        self.view = views.MapImageInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            "media_file": { "type": "string", "required": False, "read_only": True },
            'status': {'read_only': False, 'required': True, 'type': 'field' }
        })
        
    def test_update_print_using_put(self, **kwargs):
        response = self.client_user.get(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        # check status is initially "PROCESSED_SUCCESSFULLY"
        self.assertEqual(response.data.get('status'), models.StatusCode.PROCESSED_SUCCESSFULLY)
        self.assertFalse(response.data.get('source_print') == self.source_print.id)
        
        # update status to "READY_FOR_PROCESSING"
        response = self.client_user.put(
            self.url,
            json.dumps({
                'status': models.StatusCode.READY_FOR_PROCESSING,
                'source_print': self.source_print.id
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # make sure it returned "READY_FOR_PROCESSING"
        self.assertEqual(response.data.get('status'), models.StatusCode.READY_FOR_PROCESSING)
        # make sure it committed "READY_FOR_PROCESSING" to database:
        mapimage = models.MapImage.objects.get(id=self.mapimage.id)
        self.assertEqual(mapimage.status.id, models.StatusCode.READY_FOR_PROCESSING)
        self.assertEqual(response.data.get('source_print'), self.source_print.id)

