import os, json
from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from localground.apps.site.api.fields.list_field import convert_tags_to_list

import urllib, json, requests
from rest_framework import status

def get_metadata():
    return {
        "url": { "type": "field", "required": False, "read_only": True },
        "id": { "type": "integer", "required": False, "read_only": True },
        "name": { "type": "string", "required": False, "read_only": False },
        "overlay_type": { "type": "field", "required": False, "read_only": True },
        "tags": { "type": "field", "required": False, "read_only": False },
        "owner": { "type": "field", "required": False, "read_only": True },
        "project_id": { "type": "field", "required": False, "read_only": False },
        "geometry": { "type": "geojson", "required": False, "read_only": False },
        "attribution": { "type": "string", "required": False, "read_only": False },
        "file_name": { "type": "string", "required": False, "read_only": True },
        "caption": { "type": "memo", "required": False, "read_only": False },
        "path_large": { "type": "field", "required": False, "read_only": True },
        "path_medium": { "type": "field", "required": False, "read_only": True },
        "path_medium_sm": { "type": "field", "required": False, "read_only": True },
        "path_small": { "type": "field", "required": False, "read_only": True },
        "path_marker_lg": { "type": "field", "required": False, "read_only": True },
        "path_marker_sm": { "type": "field", "required": False, "read_only": True },
        "file_path_orig": { "type": "field", "required": False, "read_only": True },
        "media_file": { "type": "string", "required": True, "read_only": False },
        'extras': {'read_only': False, 'required': False, 'type': 'json'}
    }
extras = {
    "source": "http://google.com",
    "video": "youtube.com",
    "order": 5
}
point = {
    "type": "Point",
    "coordinates": [12.492324113849, 41.890307434153]
}

class ApiPhotoListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/photos/']
        self.view = views.PhotoList.as_view()
        self.metadata = get_metadata()

    def test_create_photo_using_post(self, **kwargs):
        import Image, tempfile
        image = Image.new('RGB', (100, 100))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        author_string = 'Author of the media file'
        tags = "j,k,l"
        with open(tmp_file.name, 'rb') as data:
            response = self.client_user.post(
                self.urls[0], 
                {
                    'project_id': self.project.id,
                    'media_file' : data,
                    'attribution': author_string,
                    'extras': json.dumps(extras),
                    'geometry': json.dumps(point),
                    'tags' : tags
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
       
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            # a few more checks to make sure that file paths are being
            # generated correctly:
            new_photo = models.Photo.objects.get(id=response.data.get("id"))
            file_name = tmp_file.name.split("/")[-1]
            file_name = unicode(file_name, "utf-8")
            self.assertEqual(file_name, new_photo.name)
            self.assertEqual(author_string, new_photo.attribution)
            self.assertEqual(extras, new_photo.extras)
            self.assertEqual(point, json.loads(new_photo.geometry.geojson))
            self.assertEqual(convert_tags_to_list(tags), new_photo.tags)
            self.assertEqual(file_name, new_photo.file_name_orig)
            self.assertTrue(len(new_photo.file_name_new) > 5) #ensure not empty
            self.assertEqual(settings.SERVER_HOST, new_photo.host)
            paths = [
                response.data.get("path_large"),
                response.data.get("path_medium"),
                response.data.get("path_medium_sm"),
                response.data.get("path_small"),
                response.data.get("path_marker_lg"),
                response.data.get("path_marker_sm")
            ]
            for path in paths:
                self.assertNotEqual(path.find('/profile/photos/'), -1)
                self.assertNotEqual(path.find(new_photo.host), -1)
                self.assertTrue(len(path.split('/')[-2]) > 40)
            
            
class ApiPhotoInstanceTest(test.TestCase, ViewMixinAPI):

    def create_photo_with_file(self):
        import Image
        image = Image.new('RGB', (200, 100))
        image.save('test.jpg')
        with open('test.jpg', 'rb') as data:
            response = self.client_user.post(
                '/api/0/photos/',
                { 'project_id': self.project.id, 'media_file': data },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            return models.Photo.objects.get(id=response.data.get("id"))
    
    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        self.photo = self.create_photo_with_file()
        self.url = '/api/0/photos/%s/' % self.photo.id
        self.urls = [self.url]
        self.view = views.PhotoInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({"media_file": { "type": "string", "required": False, "read_only": True }})
        
    def tearDown(self):
        #delete method also removes files from file system:
        for photo in models.Photo.objects.all():
            photo.delete()
        if os.path.exists('test.jpg'):
            os.remove('test.jpg')

    def test_update_photo_using_put(self, **kwargs):
        name, description = 'New Photo Name', 'Test description'
        tags = "a, b, d"
        response = self.client_user.put(self.url,
                    data=json.dumps({
                        'geometry': json.dumps(point),
                        'name': name,
                        'caption': description,
                        'tags' : tags,
                        'extras': json.dumps(extras)
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/json"
                )
        """
        response = self.client_user.put(self.url,
            data=urllib.urlencode({
                'geometry': point,
                'name': name,
                'caption': description,
                'tags' : tags,
                'extras': json.dumps(extras)
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        """
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_photo = models.Photo.objects.get(id=self.photo.id)
        self.assertEqual(updated_photo.name, name)
        self.assertEqual(updated_photo.description, description)
        self.assertEqual(response.data.get("caption"), description)
        self.assertEqual(updated_photo.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_photo.geometry.x, point['coordinates'][0])
        self.assertEqual(updated_photo.extras, extras)
        self.assertEqual(updated_photo.tags, convert_tags_to_list(tags))

    def test_update_photo_using_patch(self, **kwargs):
        import json
        response = self.client_user.patch(self.url,
                                          data=urllib.urlencode({'geometry': point}),
                                          HTTP_X_CSRFTOKEN=self.csrf_token,
                                          content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_photo = models.Photo.objects.get(id=self.photo.id)
        self.assertEqual(updated_photo.geometry.y, point['coordinates'][1])
        self.assertEqual(updated_photo.geometry.x, point['coordinates'][0])

    def test_delete_photo(self, **kwargs):
        photo_id = self.photo.id

        # ensure photo exists:
        models.Photo.objects.get(id=photo_id)

        # delete photo:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Photo.objects.get(id=photo_id)
            # throw assertion error if photo still in database
            print 'Photo not deleted'
            self.assertEqual(1, 0)
        except models.Photo.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)
    
    def test_rotate_photo_left_using_put(self, **kwargs):
        self._test_rotate_photo_using_put('/api/0/photos/%s/rotate-left/' % self.photo.id, **kwargs)
        
    def test_rotate_photo_right_using_put(self, **kwargs):
        self._test_rotate_photo_using_put('/api/0/photos/%s/rotate-right/' % self.photo.id, **kwargs)
            
    def _test_rotate_photo_using_put(self, rotation_url, **kwargs):
        import Image
        img_path = '%s%s' % (self.photo.get_absolute_path(), self.photo.file_name_orig)
        img = Image.open(img_path)
        (width, height) = img.size
        
        #check that the dimensions are as they should be:
        self.assertEqual(width, 200)
        self.assertEqual(height, 100)
        
        #call rotate function:
        response = self.client_user.put(
                            rotation_url,
                            HTTP_X_CSRFTOKEN=self.csrf_token,
                            content_type="application/x-www-form-urlencoded"
                        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_photo = models.Photo.objects.get(id=self.photo.id)
        
        img_path = '%s%s' % (updated_photo.get_absolute_path(), updated_photo.file_name_orig)
        img = Image.open(img_path)
        (width, height) = img.size
        self.assertEqual(width, 100)
        self.assertEqual(height, 200)
        

