from django import test
from localground.apps.site import models
from localground.apps.site.api import views
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.lib.helpers import get_timestamp_no_milliseconds
from django.db import transaction


def get_metadata_records():
    return {
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False, 'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'}
    }

class FormDataTestMixin(object):

    POINT = {
        "type": "Point",
        "coordinates": [12.492324113849, 41.890307434153]
    }

    def create_form_post_data(self):
        lat, lng, description, color = 54.16, 60.4, \
            'Test description1', 'FF0000'
        vals = [
            'a different test string',          # TEXT
            897,                                # INTEGER
            get_timestamp_no_milliseconds(),    # DATE_TIME
            True,                               # BOOLEAN
            4.5,                                # DECIMAL
            10,                                 # RATING,
            'red'                               # CHOICE
        ]
        d = {
            'geometry': self.POINT,
            'project_id': self.project.id
        }
        # add dynamic form values:
        fields = self.form.fields
        for i, field in enumerate(fields):
            d[field.col_name] = vals[i]
        return d

    def test_check_metadata(self):
        for url in self.urls:
            response = self.client_user.options(url,
                                HTTP_X_CSRFTOKEN=self.csrf_token,
                                content_type="application/x-www-form-urlencoded"
                            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            fields = response.data['actions'].get('PUT') or response.data['actions'].get('POST')

            #ensure that dictionary is not empty:
            self.assertFalse(not fields)

            #ensure that the fields dictionary are the same length:
            self.assertTrue(len(fields.keys()) >= len(self.metadata.keys()))

            #ensure that field specs match:
            for key in self.metadata.keys():
                self.assertEqual(fields[key]['type'], self.metadata[key]['type'])
                self.assertEqual(fields[key]['required'], self.metadata[key]['required'])
                self.assertEqual(fields[key]['read_only'], self.metadata[key]['read_only'])

    def verify_success(self, d):
        rec = self.form.TableModel.objects.all().order_by('-id',)[0]
        self.assertEqual(rec.geometry, GEOSGeometry(json.dumps(self.POINT)))
        fields = self.form.fields
        length = len(d.keys()) - 1
        for i in range(0, len(fields)):
            self.assertEqual(
                d.get(
                    fields[i].col_name), getattr(
                    rec, fields[i].col_name))


class ApiFormDataListTest(test.TestCase, FormDataTestMixin, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.metadata = get_metadata_records()
        self.metadata['photo_count'] = {'read_only': True, 'required': False, 'type': 'field' }
        self.metadata['audio_count'] = {'read_only': True, 'required': False, 'type': 'field' }
        self.form = self.create_form_with_fields(
            name="Class Form",
            num_fields=6)
        self.rec_1 = self.insert_form_data_record(form=self.form, project=self.project)
        self.url = '/api/0/forms/%s/data/' % self.form.id
        self.urls = [self.url]
        self.view = views.FormDataList.as_view()

    def tearDown(self):
        for m in models.Form.objects.all():
            m.remove_table_from_cache()

    def test_create_record_using_post(self, **kwargs):

        # create post data:
        d = FormDataTestMixin.create_form_post_data(self)
        # post:
        response = self.client_user.post(
            self.url,
            data=urllib.urlencode(d),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        #print response.data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # verify values:
        #print d
        FormDataTestMixin.verify_success(self, d)

    def test_check_metadata(self, **kwargs):
        FormDataTestMixin.test_check_metadata(self, **kwargs)

    def test_counts_serializer(self, **kwargs):
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.audio2 = self.create_audio(self.user, self.project)
        self.create_relation(self.rec_1, self.photo1)
        self.create_relation(self.rec_1, self.audio1)
        self.create_relation(self.rec_1, self.audio2)

        response = self.client_user.get(self.url)
        self.assertEqual(response.data['results'][0]['photo_count'], 1)
        self.assertEqual(response.data['results'][0]['audio_count'], 2)

        # clean up:
        self.delete_relation(self.rec_1, self.photo1)
        self.delete_relation(self.rec_1, self.audio1)
        self.delete_relation(self.rec_1, self.audio2)

class ApiFormDataInstanceTest(test.TestCase, FormDataTestMixin, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.metadata = get_metadata_records()
        self.metadata['children'] = {'read_only': True, 'required': False, 'type': 'field' }
        self.form = self.create_form_with_fields(name="Class Form", num_fields=7)
        #requery:
        self.form = models.Form.objects.get(id=self.form.id)
        self.rec_1 = self.insert_form_data_record(form=self.form, project=self.project)
        self.assertEqual(len(self.form.TableModel.objects.all()), 1)
        records = self.form.TableModel.objects.all()
        self.url = '/api/0/forms/%s/data/%s/' % (self.form.id, self.rec_1.id)
        self.urls = [self.url]
        self.view = views.FormDataInstance.as_view()

    def tearDown(self):
        for m in models.Form.objects.all():
            m.remove_table_from_cache()

    def test_check_metadata(self, **kwargs):
        FormDataTestMixin.test_check_metadata(self, **kwargs)

    def test_update_record_using_put(self, **kwargs):
        d = FormDataTestMixin.create_form_post_data(self)
        response = self.client_user.put(self.url,
        data=urllib.urlencode(d),
        HTTP_X_CSRFTOKEN=self.csrf_token,
        content_type = "application/x-www-form-urlencoded"
        )
        #print response.data
        FormDataTestMixin.verify_success(self, d)

    def test_child_serializer(self, **kwargs):
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(self.rec_1, self.photo1)
        self.create_relation(self.rec_1, self.audio1)

        response = self.client_user.get(self.url)
        self.assertEqual(len(response.data['children']['photos']['data']), 1)
        self.assertEqual(len(response.data['children']['audio']['data']), 1)

        # clean up:
        self.delete_relation(self.rec_1, self.photo1)
        self.delete_relation(self.rec_1, self.audio1)
