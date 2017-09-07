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
#why are width and height integers (as returned by options) but listed as FloatField in icon.py
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
