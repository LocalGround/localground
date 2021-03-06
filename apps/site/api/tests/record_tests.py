from django import test
from rest_framework.settings import api_settings
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
import urllib
import json
from rest_framework import status
from django.contrib.gis.geos import GEOSGeometry
from localground.apps.site.tests import Client, ModelMixin


def get_metadata():
    return {
        'description':
            {'read_only': False, 'required': False, 'type': 'string'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        "project_id": {"type": "field", "required": True, "read_only": False},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
        'dataset': {'read_only': True, 'required': False, 'type': 'field'},
        # 'media': {'read_only': True, 'required': False, 'type': 'field'},
        'attached_photos_videos': {
            'read_only': True, 'required': False, 'type': 'field'},
        'attached_audio': {
            'read_only': True, 'required': False, 'type': 'field'},
        'attached_map_images': {
            'read_only': True, 'required': False, 'type': 'field'},
        'field_1': {'read_only': False, 'required': False, 'type': 'string'},
        'field_2': {'read_only': False, 'required': False, 'type': 'integer'},
        'field_3': {'read_only': False, 'required': False, 'type': 'datetime'},
        'field_4': {'read_only': False, 'required': False, 'type': 'field'},
        'field_5': {'read_only': False, 'required': False, 'type': 'float'},
        'field_6': {'read_only': False, 'required': False, 'type': 'choice'},
        'field_7': {'read_only': False, 'required': False, 'type': 'string'}
    }


class DataMixin(object):
    Point = {
        "type": "Point",
        "coordinates": [12.492324113849, 41.890307434153]
    }
    LineString = {
        "type": "LineString",
        "coordinates": [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]]
    }
    Polygon = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy1 = {
        "type": "Polygon1",
        "coordinates": [[[100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    Crazy2 = {
        "type": "Polygon",
        "coordinates": [[[100.0, 0.0, 6, 8], [101.0, 0.0], [101.0, 1.0],
                         [100.0, 1.0], [100.0, 0.0]]]
    }
    ExtrasGood = '''{
        "source": "http://google.com",
        "video": "youtube.com",
        "order": 5
    }'''
    ExtrasBad = '''{
        "source": "http://google.com",
        "video",
        "order": 5
    }'''


class APIRecordListTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.RecordList.as_view()
        self.metadata = get_metadata()
        self.dataset = self.create_dataset_with_fields(num_fields=7)
        self.markerwattrs = self.create_record(
            self.user, self.project, dataset=self.dataset)
        self.urls = ['/api/0/datasets/%s/data/' % self.dataset.id]

    def tearDown(self):
        pass
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def test_post_individual_attrs(self):
        for d in [
            {'field_1': 'field_1 text'},
            {'field_2': 77},
            {'field_3': "2012-09-04 06:00:00"},
            {'field_4': True},
            {'field_5': 43124.543252},
            {'field_6': 2},
            {'field_7': 'Independent'}
        ]:
            default_data = {
                'project_id': self.project.id
            }
            default_data.update(d)
            urls = self.urls
            for url in urls:
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(default_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                new_marker = self.dataset.get_records().order_by('-id',)[0]

                self.assertEqual(
                    response.data[d.keys()[0]], d.values()[0]
                )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_many_attributes(self):
        hstore_data = {
            'field_1': 'field_1 text',
            'field_2': 77,
            'field_3': '2012-09-04 06:00:00',
            'field_4': True,
            'field_5': 43124.543252,
            'field_6': 2,
            'field_7': 'Independent'
        }
        dict_len = len(hstore_data)

        data = {
                'project_id': self.project.id
        }
        data.update(hstore_data)

        urls = self.urls
        for url in urls:
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                new_marker = self.dataset.get_records().order_by('-id',)[0]

                '''
                for i in range(0, dict_len):
                    self.assertEqual(
                        new_marker.attributes[
                            hstore_data.keys()[i]], hstore_data.values()[i]
                    )
                '''
                for i in range(0, dict_len):
                    self.assertEqual(
                        response.data[hstore_data.keys()[i]],
                        hstore_data.values()[i]
                    )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_fails_w_invalid_attrs(self):
        for d in [
            {'field_2': 'some text'},
            {'field_3': '199012-31T243:59:60Z'},
            {'field_4': 'invalid text'},
            {'field_5': 'invalid text'},
            {'field_6': 'nothing'}
        ]:
            default_data = {
                'project_id': self.project.id
            }
            default_data.update(d)
            urls = self.urls
            for url in urls:
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(default_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )

                new_marker = self.dataset.get_records().order_by('-id',)[0]
                '''
                self.assertEqual(
                    new_marker.attributes[d.keys()[0]], d.values()[0]
                )
                '''
                self.assertEqual(
                    response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_allow_null_posts(self):
        # Test a range of sparse options where zero or one value is populated.
        # Then loop through each option and see if it works:
        hstores = [
            {},                     # no values given (the rest are null)
            {'field_1': 'Hi!'},     # only field_1 has a value, the rest null
            {'field_2': 5},
            {'field_3': '2012-09-04 06:00:00'},
            {'field_4': False},
            {'field_5': 3.14159},
            {'field_6': 2},
            {'field_7': 'Independent'}
        ]

        for url in self.urls:
            for hstore_data in hstores:
                data = {
                    'project_id': self.project.id,
                    'name': 'test'
                }
                data.update(hstore_data)
                response = self.client_user.post(
                    url + '?project_id={0}'.format(self.project.id),
                    data=urllib.urlencode(data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                d = response.data
                for key in hstore_data.keys():
                    self.assertEqual(d.get('project_id'), self.project.id)
                    self.assertEqual(d.get('name'), 'test')
                    self.assertEqual(d.get(key), hstore_data[key])
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        for url in self.urls:
            response = self.client_user.get(url, {
                'project_id': self.project.id
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_bad_json_creates_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'name': 'New Marker Name',
                'caption': 'Test description',
                'geometry': self.Point,
                'project_id': self.project.id,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)

    # new_marker.name always returns 'None'
    def test_create_marker_point_line_poly_using_post(self, **kwargs):
        for i, url in enumerate(self.urls):
            name = 'MWA'
            description = 'Test description1'
            for k in ['Point', 'LineString', 'Polygon']:
                geom = getattr(self, k)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode({
                        'geometry': geom,
                        'name': name,
                        'caption': description,
                        'project_id': self.project.id,
                        'extras': self.ExtrasGood
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                new_marker = self.dataset.get_records().order_by('-id',)[0]

                self.assertEqual(
                    new_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(k, new_marker.geometry.geom_type)
                self.assertEqual(new_marker.project.id, self.project.id)
                self.assertEqual(
                    new_marker.extras, json.loads(self.ExtrasGood)
                )


class APIRecordInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.RecordInstance.as_view()
        self.dataset = self.create_dataset_with_fields(num_fields=7)
        self.metadata = get_metadata()
        self.metadata.update({
            'project_id':
                {'read_only': True, 'required': True, 'type': 'field'}
        })
        self.markerwattrs = self.create_record(
            self.user, self.project, dataset=self.dataset)
        self.urls = [
            '/api/0/datasets/%s/data/%s/' %
            (self.markerwattrs.dataset.id, self.markerwattrs.id)
        ]
        self.list_url = '/api/0/datasets/%s/data/' % self.dataset.id
        self.hstore_data = [
            {'field_1': 'field_1 text'},
            {'field_2': 77},
            {'field_3': '2012-09-04 06:00:00'},
            {'field_4': True},
            {'field_5': 43124.543252},
            {'field_6': 2},
            {'field_7': 'Independent'}
        ]

    def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

    def post_hstore_data_all(self, hstore_data):
        default_data = {
            'project_id': self.project.id,
            'geometry': self.Point,
            'caption': 'this is the caption text'
        }
        default_data.update(hstore_data)

        url = self.list_url + '?project_id={0}'.format(self.project.id)
        response = self.client_user.post(
            url,
            data=urllib.urlencode(default_data),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        new_marker = self.dataset.get_records().order_by('-id',)[0]
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return new_marker

    def post_hstore_data(self, hstore_data):
        mwa_ids = []
        posted_data = {}
        for d in hstore_data:
            default_data = {
                'project_id': self.project.id,
                'geometry': self.Point,
                'caption': 'this is the caption text'
            }
            default_data.update(d)

            url = self.list_url + '?project_id={0}'.format(self.project.id)
            response = self.client_user.post(
                url,
                data=urllib.urlencode(default_data),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )
            new_marker = self.dataset.get_records().order_by('-id',)[0]

            self.assertEqual(
                response.data[d.keys()[0]], d.values()[0]
            )

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # store values for upcoming test
            mwa_ids.append(new_marker.id)
            posted_data[new_marker.id] = [d.keys()[0], d.values()[0]]

            # return some information about the newly created markers
        return mwa_ids, posted_data

    def test_get(self):

        # run  self.post_hstore_data() and get info
        mwa_ids, posted_data = self.post_hstore_data(self.hstore_data)

        # now, test GET for each new marker
        for marker_id in mwa_ids:
            response = self.client_user.get(self.list_url + '%s/' % marker_id)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # test contains the key/attribute
            self.assertTrue(posted_data[marker_id][0] in response.data)

            # test key/attribute value is correct
            # having to cast to string and make everything lowercase to
            # get matches...seems like the wrong approach
            self.assertEqual(
                response.data[posted_data[marker_id][0]],
                posted_data[marker_id][1])

    def test_put(self):
        # run  self.post_hstore_data() and get info
        mwa_ids, posted_data = self.post_hstore_data(self.hstore_data)

        new_hstore_data_dict = {
            'field_1': 'new field_1 text',
            'field_2': 99,
            'field_3': '2012-09-04 07:00:00',
            'field_4': False,
            'field_5': 7777.7777,
            'field_6': 1,
            'field_7': 'Democrat'
        }

        # now, test PUT for each new marker (replace)
        for marker_id in mwa_ids:

            # first just check for some pre-existing default data
            marker = models.Record.objects.get(id=marker_id)

            url = self.list_url + '%s/' % marker_id
            key = posted_data[marker_id][0]
            new_data_item = new_hstore_data_dict[key]
            new_data = {
                key: new_data_item
            }
            response = self.client_user.put(
                    url,
                    data=urllib.urlencode(new_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # test that contains the hstore key/attribute
            self.assertTrue(posted_data[marker_id][0] in response.data)

            # test hstore key/attribute value is correct
            self.assertEqual(
                response.data[posted_data[marker_id][0]],
                new_data_item)

            # finally, check that other fields are replaced (nulled)
            marker = models.Record.objects.get(id=marker_id)

    def test_patch(self):
        marker = self.post_hstore_data_all({
            'field_1': 'field_1 text',
            'field_2': 77,
            'field_3': '2012-09-04 06:00:00',
            'field_4': True,
            'field_5': 43124.543252,
            'field_6': 2,
            'field_7': 'Independent'
        })
        self.assertEqual(
            json.loads(marker.geometry.geojson),
            self.Point
        )
        url = self.list_url + '%s/' % marker.id
        new_data = {
            'field_1': 'new field_1 text',
            'field_2': 99,
            'field_3': '2012-09-04 07:00:00',
            'field_4': False,
            'field_5': 7777.7777,
            'field_6': 1,
            'field_7': 'Democrat'
        }
        for key in new_data:
            response = self.client_user.patch(
                    url,
                    data=urllib.urlencode({
                        key: new_data[key]
                    }),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # test contains the hstore key/attribute
            self.assertTrue(key in response.data)

            # test hstore key/attribute value is correct
            self.assertEqual(response.data[key], new_data[key])

            # finally, check that other fields have not been replaced (nulled)
            marker = models.Record.objects.get(id=marker.id)
            self.assertEqual(json.loads(marker.geometry.geojson), self.Point)
            self.assertEqual(response.data['geometry'], self.Point)

        # Check that at the end of this process, all key-value
        # pairs have persisted:
        response = self.client_user.get(url)
        for key in new_data:
            self.assertEqual(response.data.get(key), new_data[key])

    def test_patch_geometry_only(self):
        record_with_geometry = self.create_record(
            self.user, self.project, dataset=self.dataset, geoJSON=self.Point)
        self.assertEqual(
            json.loads(record_with_geometry.geometry.geojson),
            self.Point
        )
        url = self.list_url + '%s/' % record_with_geometry.id
        # How to clear out geometry via Python:
        data = urllib.urlencode({
            'geometry': ''
        })
        response = self.client_user.patch(
            url,
            data=data,
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        marker = models.Record.objects.get(id=record_with_geometry.id)
        self.assertEqual(marker.geometry, None)
        self.assertEqual(response.data['geometry'], None)

    def test_bad_json_update_fails(self, **kwargs):
        # 1. define a series of bad JSON dictionaries
        for d in [
            {'geometry': self.Crazy1},
            {'geometry': self.Crazy2},
            {'extras': self.ExtrasBad}
        ]:
            params = {
                'geometry': self.Point,
                'extras': self.ExtrasGood
            }
            # 2. update the params dictionary with the invalid dictionary entry
            params.update(d)
            for i, url in enumerate(self.urls):
                response = self.client_user.put(
                    url,
                    data=urllib.urlencode(params),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")
                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST)

    def test_update_marker_using_patch(self, **kwargs):
        for k in ['Point', 'LineString', 'Polygon']:
            geom = getattr(self, k)
            for url in self.urls:
                response = self.client_user.patch(
                    url,
                    data=urllib.urlencode({'geometry': geom}),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"
                )
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                updated_marker = models.Record.objects.get(
                    id=self.markerwattrs.id)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))

    def test_delete_marker(self, **kwargs):
        marker_id = self.markerwattrs.id
        dataset_id = self.markerwattrs.dataset.id

        # ensure marker exists:
        models.Record.objects.get(id=marker_id)

        # delete marker:
        response = self.client_user.delete(
            '/api/0/datasets/%s/data/%s/' % (dataset_id, marker_id),
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Record.objects.get(id=marker_id)
            # throw assertion error if marker still in database
            print 'Marker not deleted'
            self.assertEqual(1, 0)
        except models.Record.DoesNotExist:
            # trigger assertion success if marker is removed
            self.assertEqual(1, 1)

    def test_child_serializer(self, **kwargs):
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.video1 = self.create_video(self.user, self.project)
        self.create_relation(self.markerwattrs, self.photo1)
        self.create_relation(self.markerwattrs, self.audio1)
        self.create_relation(self.markerwattrs, self.video1)

        response = self.client_user.get(self.urls[0])
        self.assertEqual(len(response.data['attached_photos_videos']), 2)
        self.assertEqual(len(response.data['attached_audio']), 1)

        # clean up:
        self.delete_relation(self.markerwattrs, self.photo1)
        self.delete_relation(self.markerwattrs, self.audio1)
        self.delete_relation(self.markerwattrs, self.video1)

    def test_attach_media(self):
        mwa_ids, posted_data = self.post_hstore_data(self.hstore_data)

        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)

        photo_data = {
            'object_id': self.photo1.id,
            'ordering': 1
        }

        audio_data = {
            'object_id': self.audio1.id,
            'ordering': 1
        }

        for marker_id in mwa_ids:
            # first just check for some pre-existing default data
            marker = models.Record.objects.get(id=marker_id)

            photo_url = self.list_url + '%s/' % marker_id + 'photos/'
            audio_url = self.list_url + '%s/' % marker_id + 'audio/'

            photo_response = self.client_user.post(
                    photo_url,
                    data=urllib.urlencode(photo_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            audio_response = self.client_user.post(
                    audio_url,
                    data=urllib.urlencode(audio_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            self.assertEqual(
                photo_response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(
                audio_response.status_code, status.HTTP_201_CREATED)
            response = self.client_user.get(self.list_url + '%s/' % marker_id)
            # print response.data
            self.assertEqual(
                response.data['attached_photos_videos'][0]['id'],
                self.photo1.id
            )
            self.assertEqual(
                response.data['attached_photos_videos'][0]['overlay_type'],
                'photo'
            )
            self.assertEqual(
                response.data['attached_audio'][0]['id'],
                self.audio1.id
            )
            self.assertEqual(
                response.data['attached_audio'][0]['overlay_type'],
                'audio'
            )
            self.assertEqual(
                len(response.data['attached_audio']), 1
            )
            self.assertEqual(
                len(response.data['attached_photos_videos']), 1
            )

            self.delete_relation(marker, self.photo1)
            self.delete_relation(marker, self.audio1)
