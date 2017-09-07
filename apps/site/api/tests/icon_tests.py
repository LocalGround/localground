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
        "size": {"type": "integer", "required": True, "read_only": False},
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

    def test_post_creates_icons_only_when_required_params_included(self, **kwargs):
        response = self.client_user.post(self.url,
                                            data=urllib.urlencode({
                                                'owner': self.user,
                                                'project_id': self.project.id,
                                                'icon_file': 'icon1.jpg',
                                                'name': 'test_icon1a'
                                                #'size': 150,
                                                #'anchor_x': 0,
                                                #'anchor_y': 0
                                            }),
                                            HTTP_X_CSRFTOKEN=self.csrf_token,
                                            content_type="application/x-www-form-urlencoded"
                                            )
        #print response.data
        #self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
#Tests to add
#api instance test
#   update using put
#   update using patch
#   delete
#   if user enters size, icon properly sized
#   if user doesn't enter size, and icon max size is greater than 
#   too small
#   anchor point(s) ouside width and height
#   incorrect file type
