import os
from django import test
from django.conf import settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from localground.apps.site.api.fields.list_field import convert_tags_to_list
import urllib
import json
import requests
from rest_framework import status


def get_metadata():
    return {
        "url": {"type": "field", "required": False, "read_only": True},
        "id": {"type": "integer", "required": False, "read_only": True},
        "name": {"type": "string", "required": False, "read_only": False},
        "icon_file": {"type": "string", "required": True, "read_only": False},
        "file_type": {"type": "choice", "required": False, "read_only": True},
        "file_path": {"type": "field", "required": False, "read_only": True},
        "owner": {"type": "field", "required": False, "read_only": True},
        "project_id": {"type": "field", "required": True, "read_only": False},
        "size": {"type": "integer", "required": False, "read_only": False},
        "width": {"type": "integer", "required": False, "read_only": True},
        "height": {"type": "integer", "required": False, "read_only": True},
        "anchor_x": {"type": "integer", "required": False, "read_only": False},
        "anchor_y": {"type": "integer", "required": False, "read_only": False},
    }


def create_temp_file(w, h):
    from PIL import Image
    import tempfile
    image = Image.new('RGB', (w, h))
    tmp_file = tempfile.NamedTemporaryFile(suffix='.jpeg')
    image.save(tmp_file)
    return tmp_file


class ApiIconListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        #self.urls = ['/api/0/icons/']
        self.urls = ['/api/0/icons/?project_id=%s' % self.project.id]
        self.url = self.urls[0]
        self.create_icon(self.user, self.project, icon_file='icon1.jpg', name='test_icon_1', size=100, anchor_x=30, anchor_y=20)
        self.create_icon(self.user, self.project, icon_file='icon2.jpg', name='test_icon_2', size=200, anchor_x=100, anchor_y=100)
        self.view = views.IconList.as_view()
        self.metadata = get_metadata()


    def test_icon_list_returns_all_icons(self, **kwargs):
        response = self.client_user.get(self.url)
        results = response.data.get("results")
        r1 = results[0]
        r2 = results[1]
        self.assertEqual(r1.get("name"), 'test_icon_1')
        self.assertEqual(r2.get("name"), 'test_icon_2')
        self.assertEqual(len(results), 2)

    def test_jpeg_to_jpg(self, **kwargs):
        tmp_file = create_temp_file(30, 30)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file' : binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["file_type"], "jpg")

    def test_check_if_size_bigger_than_max_then_error(self, **kwargs):
        tmp_file = create_temp_file(30, 30)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file' : binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 400
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
            self.assertEqual(response.data["size"][0], u"Ensure this value is less than or equal to 250.0.")

    def test_check_if_size_smaller_than_min_then_error(self, **kwargs):
        tmp_file = create_temp_file(30, 30)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file' : binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 5
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
            self.assertEqual(response.data["size"][0], u"Ensure this value is greater than or equal to 10.0.")

    def test_check_user_size_no_anchors_set_anchors(self, **kwargs):
        tmp_file = create_temp_file(20, 24)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 120
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            #print response.data
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 120)
            self.assertEqual(response.data["anchor_x"], 50 )
            self.assertEqual(response.data["anchor_y"], 60)

    def test_check_user_size_user_2_anchors(self, **kwargs):
        tmp_file = create_temp_file(22, 14)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 15,
                    'anchor_x': 8,
                    'anchor_y':9
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            #print response.data
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 15)
            self.assertEqual(response.data["anchor_x"], 8)
            self.assertEqual(response.data["anchor_y"], 9)

    def test_check_user_size_user_1_anchors(self, **kwargs):
    #uses anchor given, calculates other at midpoint of icon
        tmp_file = create_temp_file(32, 20)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 16,
                    'anchor_x': 0
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            #print response.data
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 16)
            self.assertEqual(response.data["anchor_x"], 0)
            self.assertEqual(response.data["anchor_y"], 5)

    def test_check_user_size_user_bad_anchors(self, **kwargs):
        #if anchors are outside of icon, calculates anchors at midpoint of icon
        tmp_file = create_temp_file(32, 20)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'size': 16,
                    'anchor_x': 40,
                    'anchor_y': 50
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            #print response.data
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 16)
            self.assertEqual(response.data["anchor_x"], 8)
            self.assertEqual(response.data["anchor_y"], 5)

    def test_check_if_no_size_then_use_icon_size_set_anchors(self, **kwargs):
        tmp_file = create_temp_file(200, 244)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 244)
            self.assertEqual(response.data["anchor_x"], 100)
            self.assertEqual(response.data["anchor_y"], 122)

    def test_check_if_no_size_icon_too_big_then_use_max_size_set_anchors(self, **kwargs):
        tmp_file = create_temp_file(260, 100)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 250)
            self.assertEqual(response.data["anchor_x"], 125)

    #case below tests as written.  Sarah asked to rewrite to give error
    def test_check_if_no_size_icon_too_small_then_use_min_size_set_anchors(self, **kwargs):
        tmp_file = create_temp_file(8, 5)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            self.assertEqual(response.data["size"], 10)
            self.assertEqual(response.data["anchor_x"], 8)
            self.assertEqual(response.data["anchor_y"], 5)

    #case below tests as written.  Sarah asked to rewrite to give error
    def test_if_no_size_icon_too_small_one_side_then_scale_set_anchors(self, **kwargs):
        tmp_file = create_temp_file(5, 200)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_201_CREATED, response.status_code)
            #ensure that icon is scaled to make icon small side as large as possible
            #while keeping the large side within the maximum size allowed
            self.assertEqual(response.data["size"], 250)
            self.assertEqual(response.data["anchor_x"], 3)
            self.assertEqual(response.data["anchor_y"], 125)

    def test_cannot_create_icon_if_no_prj_permissison_or_no_prj_defined(
            self, **kwargs):
        print self.urls[0]
        random_user = self.create_user(username="Rando")
        random_project = self.create_project(
            random_user, name='Random Project')
        project_ids = [random_project.id, 999999999]
        for project_id in project_ids:
            tmp_file = create_temp_file(5, 200)
            with open(tmp_file.name, 'rb') as binaryImage:
                response = self.client_user.post(
                    self.urls[0],
                    {
                        'icon_file': binaryImage,
                        'project_id': project_id,
                        'owner': random_user
                    },
                    HTTP_X_CSRFTOKEN=self.csrf_token)
                print response.data
                self.assertEqual(
                    status.HTTP_400_BAD_REQUEST, response.status_code)
                self.assertEqual(
                    response.data['project_id'],
                    [u'Invalid pk "%s" - object does not exist.' % project_id]
                )


class ApiIconInstanceTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        self.icon1 = self.create_icon_post()
        self.icon2 = self.create_icon_post()
        self.url = '/api/0/icons/{0}/?project_id={1}'.format(
            self.icon1.id, self.project.id)
        self.urls = [self.url]
        self.view = views.IconInstance.as_view()
        self.metadata = get_metadata()
        self.metadata.update({
            'icon_file': {'type': 'string', 'required': False, 'read_only': True},
            'project_id': {'read_only': True, 'required': False, 'type': 'field'}
        })

    def tearDown(self):
        #delete method also removes files from file system:
        for icon in models.Icon.objects.all():
            icon.delete()
        if os.path.exists('icon1.jpg'):
            os.remove('icon1.jpg')

    def create_icon_post(self):
        tmp_file = create_temp_file(30, 30)
        with open(tmp_file.name, 'rb') as binaryImage:
            #new_url = ['/api/0/projects/%s/icons/' % self.project.id]
            #print new_url
            response = self.client_user.post(
                '/api/0/icons/',
                #new_url,
                {
                    'icon_file': binaryImage,
                    'project_id': self.project.id,
                    'owner': self.user,
                    'name': 'icon1'
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
        return models.Icon.objects.get(id=response.data.get('id'))

    #put/patch - update
    #set anchor and size, not anything else

    '''
    The following tests involving client_user.put and patch,
    based on data dictionary,
    fails to apply the changes from the dictionary to an updated object
    because we are trying to modify an existing image
    which requires it to be opened manually(?)
    Based on the django test api:
    https://docs.djangoproject.com/en/2.0/topics/testing/tools/
    '''
    def test_required_params_and_resize_using_put(self, **kwargs):
        response = self.client_user.put(self.url,
                                        data=urllib.urlencode({
                                            'name': 'icon_new',
                                            'size': 40,
                                            'anchor_x': 10,
                                            'anchor_y': 15
                                        }),
                                        HTTP_X_CSRFTOKEN=self.csrf_token,
                                        content_type="application/x-www-form-urlencoded"
                                        )
        print('**** ICON TEST REQUIRED PARAMS AND RESIZE USING PUT ****')
        print(response.data)
        print('**** ICON TEST REQUIRED PARAMS AND RESIZE USING PUT ****')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_icon = models.Icon.objects.get(id=self.icon1.id)
        self.assertEqual(updated_icon.name, 'icon_new')
        self.assertEqual(updated_icon.size, 40)
        self.assertEqual(updated_icon.anchor_x, 10)
        self.assertEqual(updated_icon.anchor_y, 15)
        self.assertEqual(updated_icon.last_updated_by, self.user)

    def test_patch_name(self, **kwargs):
        response = self.client_user.patch(self.url,
                                        data=urllib.urlencode({
                                            'name': 'icon_patch',
                                        }),
                                        HTTP_X_CSRFTOKEN=self.csrf_token,
                                        content_type="application/x-www-form-urlencoded"
                                        )
        print('**** ICON TEST PATCH NAME ****')
        print(response.data)
        print('**** ICON TEST PATCH NAME ****')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_icon = models.Icon.objects.get(id=self.icon1.id)
        self.assertEqual(updated_icon.name, 'icon_patch')
        self.assertEqual(updated_icon.size, 30)
        self.assertEqual(updated_icon.last_updated_by, self.user)

    def test_patch_resize(self, **kwargs):
        response = self.client_user.patch(self.url,
                                        data=urllib.urlencode({
                                            'size': 50,
                                        }),
                                        HTTP_X_CSRFTOKEN=self.csrf_token,
                                        content_type="application/x-www-form-urlencoded"
                                        )
        print('**** ICON TEST PATCH RESIZE ****')
        print(response.data)
        print('**** ICON TEST PATCH RESIZE ****')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_icon = models.Icon.objects.get(id=self.icon1.id)
        self.assertEqual(updated_icon.name, 'icon1')
        self.assertEqual(updated_icon.size, 50)
        self.assertEqual(updated_icon.width, 50)
        self.assertEqual(updated_icon.height, 50)
        self.assertEqual(updated_icon.last_updated_by, self.user) #get - query


    def test_delete_icon(self, **kwargs):
        icon_id = self.icon1.id

        # ensure icon exists:
        models.Icon.objects.get(id=icon_id)

        # delete icon:
        response = self.client_user.delete(self.url,
                                           HTTP_X_CSRFTOKEN=self.csrf_token
                                           )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Icon.objects.get(id=icon_id)
            # throw assertion error if photo still in database
            print 'Icon not deleted'
            self.assertEqual(1, 0)
        except models.Icon.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)


    def test_delete_icon_no_permission(self, **kwargs):
        random_user = self.create_user(username="Rando")

        # now, random_user is logged into Local Ground (instead of tester)
        client_user = self.get_client_user(random_user)
        icon_id = self.icon1.id
        # ensure icon exists:
        models.Icon.objects.get(id=icon_id)
        # delete icon:
        response = client_user.delete(self.url,
                                      HTTP_X_CSRFTOKEN=self.csrf_token
                                     )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # check to make sure it's still there:
        try:
            models.Icon.objects.get(id=icon_id)
            # throw assertion error if photo still in database
            self.assertEqual(1, 1)
        except models.Icon.DoesNotExist:
            # trigger assertion success if photo is not deleted
            self.assertEqual(1, 0)

    def test_get_deny_no_permission(self, **kwargs):
        random_user = self.create_user(username="Rando")

        # now, random_user is logged into Local Ground (instead of tester)
        client_user = self.get_client_user(random_user)
        icon_id = self.icon1.id
        # ensure icon exists:
        models.Icon.objects.get(id=icon_id)
        # query icon:
        response = client_user.get(self.url,
                                      HTTP_X_CSRFTOKEN=self.csrf_token
                                      )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
