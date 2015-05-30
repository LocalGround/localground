from django import test
from localground.apps.site.views import profile
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status


class ObjectListFormProfileTest(test.TestCase, ViewMixin):

    def setUp(self):
        ViewMixin.setUp(self, load_fixtures=True)
        self.urls = ['/profile/photos/',
                     '/profile/audio/',
                     '/profile/prints/',
                     '/profile/map-images/',
                     '/profile/forms/'
                     ]
        self.view = profile.object_list_form

    def _delete_batch(self, model, create_function=None):
        ids = [1, 2]
        if create_function is not None:
            a = create_function()
            b = create_function()
            ids = [a.id, b.id]
        # ensure that both photos exist:
        self.assertEqual(len(model.objects.filter(id__in=ids)), 2)

        # Delete over HTTP (using POST)
        url = '/profile/%s/delete/batch/' % model.model_name_plural
        response = self.client_user.post(
            url,
            data='id=%s&id=%s' %
            (ids[0],
             ids[1]),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # ensure that both photos have been deleted:
        self.assertEqual(len(model.objects.filter(id__in=[1, 2])), 0)

    def test_batch_delete_photos_post(self, **kwargs):
        # photos already populated via fixtures
        self._delete_batch(models.Photo)

    def test_batch_delete_audio_post(self, **kwargs):
        # audio already populated via fixtures
        self._delete_batch(models.Audio)

    def test_batch_delete_print_post(self, **kwargs):
        self._delete_batch(models.Print, create_function=self.create_print)

    def test_batch_delete_form_post(self, **kwargs):
        self._delete_batch(models.Form, create_function=self.create_form)
