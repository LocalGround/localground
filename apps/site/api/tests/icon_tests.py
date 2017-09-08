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

class ApiIconListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.urls = ['/api/0/icons/']
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

    def create_temp_file(self, w, h):
        from PIL import Image
        import tempfile
        image = Image.new('RGB', (w, h))
        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpeg')
        image.save(tmp_file)
        return tmp_file

    def test_jpeg_to_jpg(self, **kwargs):
        tmp_file = self.create_temp_file(30, 30)
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
        tmp_file = self.create_temp_file(30, 30)
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
        tmp_file = self.create_temp_file(30, 30)
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
        tmp_file = self.create_temp_file(20, 24)
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
        tmp_file = self.create_temp_file(22, 14)
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
        tmp_file = self.create_temp_file(32, 20)
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
        tmp_file = self.create_temp_file(32, 20)
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
        tmp_file = self.create_temp_file(200, 244)
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
        tmp_file = self.create_temp_file(260, 100)
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
        tmp_file = self.create_temp_file(8, 5)
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
        tmp_file = self.create_temp_file(5, 200)
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

    def test_access_denied_if_no_project_permisison(self, **kwargs):
        random_user=self.create_user(username="Rando")
        #random_project=self.create_project(random_user, name='Random Project')
        import random 
        from localground.apps.site import models
        slug = ''.join(random.sample(
            '0123456789abcdefghijklmnopqrstuvwxyz', 16))
        random_project = models.Project(
            name='Random Project',
            owner=random_user,
            last_updated_by=random_user,
            access_authority=models.ObjectAuthority.objects.get(
                id=1),
            slug=slug)
        random_project.save()
        tmp_file = self.create_temp_file(5, 200)
        with open(tmp_file.name, 'rb') as binaryImage:
            response = self.client_user.post(
                self.urls[0],
                {
                    'icon_file': binaryImage,
                    'project_id': random_project.id,
                    'owner': random_user
                },
                HTTP_X_CSRFTOKEN=self.csrf_token)
            self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        print response.data
