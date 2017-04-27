from django import test
from localground.apps.site.views import maps
from localground.apps.site.tests import ViewMixin, ViewAnonymousMixin
from rest_framework import status

class MapEditorTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = ['/maps/edit/new/']
        self.view = maps.show_map_editor_new