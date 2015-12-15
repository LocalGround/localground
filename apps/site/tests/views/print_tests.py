from django import test
from localground.apps.site.views import prints, profile
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
import urllib


class PrintViewTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        self.url = '/maps/print/new/'
        self.urls = [self.url]
        self.view = prints.generate_print_new
        self.print_obj = None

    def teardown(self):
        if self.print_obj is not None:
            self.print_obj.delete()

    def test_create_print_with_scan_using_post(self, **kwargs):
        lat, lng = 54.16, 60.4
        map_title = 'A Map Title'
        instructions = 'Some instructions.'
        layout = 2  # portrait
        map_provider = 12
        zoom = 17
        scan = self.create_scan(self.user, self.project)
        self.assertEqual(len(models.Print.objects.all()), 1)
        num_fields = 2
        d = {
            'center_lat': lat,
            'center_lng': lng,
            'scan_ids': str(scan.id),
            'map_title': map_title,
            'instructions': instructions,
            'orientation': 'portrait',
            'map_provider': map_provider,
            'basemap_id': map_provider,
            'zoom': zoom,
            'project_id': self.project.id,
            'generate_pdf': 'on'
        }

        response = self.client_user.post(
            self.url,
            data=urllib.urlencode(d),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.print_obj = (models.Print.objects
                          .select_related('layout', 'map_provider')
                          .all()
                          .order_by('-id',))[0]
        self.assertEqual(self.print_obj.name, map_title)
        self.assertEqual(self.print_obj.description, instructions)
        self.assertEqual(self.print_obj.center.y, lat)
        self.assertEqual(self.print_obj.center.x, lng)
        self.assertEqual(self.print_obj.project.id, self.project.id)
        self.assertEqual(self.print_obj.layout.id, layout)
        self.assertEqual(self.print_obj.map_provider.id, map_provider)
        self.assertEqual(1, len(self.print_obj.embedded_scans))


class PrintProfileTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self)
        self.urls = ['/profile/prints/']
        self.view = profile.object_list_form
