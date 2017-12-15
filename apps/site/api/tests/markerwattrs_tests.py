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
        'caption': {'read_only': False, 'required': False, 'type': 'memo'},
        'tags': {'read_only': False, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'overlay_type': {'read_only': True, 'required': False,
                         'type': 'field'},
        'geometry': {'read_only': False, 'required': False, 'type': 'geojson'},
        'owner': {'read_only': True, 'required': False, 'type': 'field'},
        'project_id': {'read_only': False, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'name': {'read_only': False, 'required': False, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
        'form': {'read_only': True, 'required': False, 'type': 'field'},
        'field_1': {'read_only': False, 'required': False, 'type': 'string'},
        'field_2': {'read_only': False, 'required': False, 'type': 'integer'},
        'field_3': {'read_only': False, 'required': False, 'type': 'datetime'},
        'field_4': {'read_only': False, 'required': False, 'type': 'boolean'},
        'field_5': {'read_only': False, 'required': False, 'type': 'decimal'},
        'field_6': {'read_only': False, 'required': False, 'type': 'choice'},
        'field_7': {'read_only': False, 'required': False, 'type': 'choice'}
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

class APIMarkerWAttrsListTest(test.TestCase, ViewMixinAPI, DataMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsList.as_view()
        self.metadata = get_metadata()
        form = self.create_form_with_fields(num_fields=7)
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project, form=form)
        self.urls = ['/api/0/forms/%s/data/' % form.id]

    def tearDown(self):
        pass
        # delete method also removes files from file system:
        # models.Photo.objects.all().delete()
        # models.Audio.objects.all().delete()

    def test_post_individual_attrs(self):
        '''
        DATE_INPUT_FORMATS = ('%m/%d/%Y', '%Y-%m-%d', '%m/%d/%y', '%m-%d-%y', '%m-%d-%Y')
        TIME_INPUT_FORMATS = ('%I:%M:%S %p', '%H:%M:%S', '%H:%M')
        %Y-%m-%dT%H:%M:%S'
        '''
        # YYYY-MM-DD HH:MM[:ss[.uuuuuu]][TZ]
        # (2012, 9, 4, 6, 0)
        for d in [
            # {'field_1': 'field_1 text'},
            # {'field_2': 77}, # should not be a string?
            {'field_3': "2012-09-04 06:00:00"}, #Can't get DateTime to work
            # {'field_4': 'true'}, # should not be a string?
            # {'field_5': '43124.543252'},
            # {'field_6': '2'},
            # {'field_7': 'Independent'}
        ]:
            default_data = {
                'project_id': self.project.id
            }
            default_data.update(d)
            urls = self.urls
            #print(api_settings.DATE_INPUT_FORMATS)
            for url in urls:
                url = url + '?project_id={0}'.format(self.project.id)
                response = self.client_user.post(
                    url,
                    data=urllib.urlencode(default_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded"    
                )
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                #print(models.MarkerWithAttributes.objects.all())
                print(new_marker.attributes)
                print(d.values()[0])
                print(response.data)
                self.assertEqual(
                    response.data[d.keys()[0]], d.values()[0]
                )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_many_attributes(self):
        hstore_data = {
            'field_1': 'field_1 text',
            'field_2': '77',
            #'field_3': '1990-12-31T23:59:60Z', #Can't get DateTime to work
            'field_4': 'true',
            'field_5': '43124.543252',
            'field_6': '2',
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
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                #print(models.MarkerWithAttributes.objects.all())
                #print(response.data)
                
                # print(new_marker.attributes)
                # print(new_marker.id)
                for i in range(0, dict_len):
                    self.assertEqual(
                        new_marker.attributes[hstore_data.keys()[i]], hstore_data.values()[i]
                    )
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_fails_w_invalid_attrs(self):
        for d in [
            #{'field_1': 33},
            {'field_2': 'some text'}, 
            #{'field_3': '1990-12-31T23:59:60Z'}, #Can't get DateTime to work
            {'field_4': 'invalid text'}, # should not be a string?
            {'field_5': 'invalid text'},
            # {'field_6': 'nothing'}, # problems with ChoiceIntField exception handling
            {'field_7': 'Invalid text'}
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
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                #print(models.MarkerWithAttributes.objects.all())
                #print(response.data)
                '''
                self.assertEqual(
                    new_marker.attributes[d.keys()[0]], d.values()[0]
                )
                '''
                # print('failed for: ', d.keys()[0], response.status_code)
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
                # print('failure test passed for: ', d.keys()[0])

    def test_allow_null_posts(self):
        # having difficulty getting Django to allow null values, 
        # esp. for numerical entries
        hstore_data = {
            'field_1': '',
            #'field_2': None,
            #'field_3': '1990-12-31T23:59:60Z', #Can't get DateTime to work
            #'field_4': False,
            #'field_5': None,
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
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                #print(models.MarkerWithAttributes.objects.all())
                # print('response: ', response.data)
                # print()
                # print('marker attrs: ', new_marker.attributes)
                # print(new_marker.id)
                for i in range(0, dict_len):
                    self.assertEqual(
                        new_marker.attributes[hstore_data.keys()[i]], hstore_data.values()[i]
                    )
                
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)

                


    '''
    def test_page_500_status_basic_user(self, urls=None, **kwargs):
        if urls is None:
            urls = self.urls
        for url in urls:
            response = self.client_user.get(url)
            #print(response.data)
            self.assertEqual(
                response.status_code,
                status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    '''

    def test_page_200_status_basic_user(self, urls=None, **kwargs):
        for url in self.urls:
            response = self.client_user.get(url, {
                'project_id': self.project.id
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)

    '''
    def test_metadata_only_available_with_flag(self, **kwargs):
        response = self.client_user.get(
            self.urls[0], {
                'marker_with_media_arrays': True,
                'project_id': self.project.id
            }
        )
        m = response.data.get("results")[0]
        self.assertIsNone(m.get("update_metadata"))

        response = self.client_user.get(
            self.urls[0], {
                'include_metadata': True,
                'project_id': self.project.id
            }
        )
        m = response.data.get("results")[0]
        self.assertIsNotNone(m.get("update_metadata"))
    '''
    '''
    def test_arrays_available_when_flag_exists(self):
        # create some associations:
        self.photo1 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.create_relation(self.markerwattrs, self.photo1)
        self.create_relation(self.markerwattrs, self.audio1)
        response = self.client_user.get(
            self.urls[0], {
                'marker_with_media_arrays': True,
                'project_id': self.project.id
            }
        )
        markerwattrs = response.data.get("results")[0]
        self.assertEqual(len(markerwattrs.get('photo_array')), 1)
        self.assertEqual(len(markerwattrs.get('audio_array')), 1)
        self.assertTrue('map_image_array' in markerwattrs)

        # clean up:
        self.delete_relation(self.markerwattrs, self.photo1)
        self.delete_relation(self.markerwattrs, self.audio1)
    '''
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
                if response.status_code != status.HTTP_201_CREATED:
                    print('196: ', response.data)
                    print('196: ', response.data)
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
                #print(models.MarkerWithAttributes.objects.all().order_by('-id',))
                #print(new_marker.id)
                #print(response.data)
                self.assertEqual(new_marker.name, name)
                self.assertEqual(new_marker.description, description)
                self.assertEqual(
                    new_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))
                self.assertEqual(k, new_marker.geometry.geom_type)
                self.assertEqual(new_marker.project.id, self.project.id)
                self.assertEqual(
                    new_marker.extras, json.loads(self.ExtrasGood)
                )
        


class APIMarkerWAttrsInstanceTest(test.TestCase, ViewMixinAPI, DataMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.view = views.MarkerWAttrsInstance.as_view()
        form = self.create_form_with_fields(num_fields=7)
        self.metadata = get_metadata()
        self.markerwattrs = self.create_marker_w_attrs(self.user, self.project, form=form)
        self.urls = ['/api/0/forms/%s/data/%s/' % \
            (self.markerwattrs.form.id, self.markerwattrs.id)]
        self.list_url = '/api/0/forms/%s/data/' % form.id
        self.hstore_data = [
            {'field_1': 'field_1 text'},
            {'field_2': '77'}, # should not be a string?
            #{'field_3': '1990-12-31T23:59:60Z'}, #Can't get DateTime to work
            {'field_4': 'true'}, # should not be a string?
            #{'field_5': '43124.543252'}, 
            {'field_6': '2'},
            {'field_7': 'Independent'}
        ]

    def tearDown(self):
        # delete method also removes files from file system:
        models.Photo.objects.all().delete()
        models.Audio.objects.all().delete()

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
            new_marker = models.MarkerWithAttributes.objects.all().order_by('-id',)[0]
           
            self.assertEqual(
                new_marker.attributes[d.keys()[0]], d.values()[0]
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
            # having to cast to string and make everything lowercase to get matches
            # ...seems like the wrong approach
            self.assertEqual(
                str(response.data[posted_data[marker_id][0]]).lower(), 
                posted_data[marker_id][1].lower())

    
    def test_put(self):
        # run  self.post_hstore_data() and get info
        mwa_ids, posted_data = self.post_hstore_data(self.hstore_data)

        new_hstore_data_dict = {
            'field_1': 'new field_1 text',
            'field_2': '88', # should not be a string?
            #'field_3': '2002-12-31T23:59:60Z', #Can't get DateTime to work
            'field_4': 'false', # should not be a string?
            #'field_5': '7777.7777', 
            'field_6': '1',
            'field_7': 'Democrat'
        }


        # now, test PUT for each new marker (replace)
        for marker_id in mwa_ids:

            # first just check for some pre-existing default data
            marker = models.MarkerWithAttributes.objects.get(id=marker_id)
            '''
            self.assertEqual(
                json.loads(marker.geometry.geojson), 
                self.Point
            )
            '''

            self.assertEqual(
                marker.description,
                'this is the caption text'
            )

            url = self.list_url + '%s/' % marker_id
            key = posted_data[marker_id][0]
            new_data_item = new_hstore_data_dict[key]
            new_data = {
                key: new_data_item,
                'caption': None,
            }

            response = self.client_user.put(
                    url,
                    data=urllib.urlencode(new_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            # print(new_data)
            # print(response.data)
            # print(response.status_code)
            # print('   ')
            # test contains the hstore key/attribute
            self.assertTrue(posted_data[marker_id][0] in response.data)

            # test hstore key/attribute value is correct
            # having to cast to string and make everything lowercase to get matches
            # ...seems like the wrong approach
            self.assertEqual(
                str(response.data[posted_data[marker_id][0]]).lower(), 
                new_data_item.lower())

            # finally, check that other fields are replaced (nulled)
            marker = models.MarkerWithAttributes.objects.get(id=marker_id)
            self.assertEqual(marker.description, 'None')
            self.assertEqual(response.data['caption'], 'None')
            '''
            self.assertEqual(marker.geometry.geojson, None)
            self.assertEqual(response.data['geometry'], None)
            '''

    
    def test_patch(self):
        # run  self.post_hstore_data() and get info
        mwa_ids, posted_data = self.post_hstore_data(self.hstore_data)

        new_hstore_data_dict = {
            'field_1': 'new field_1 text',
            'field_2': '88', # should not be a string?
            #'field_3': '2002-12-31T23:59:60Z', #Can't get DateTime to work
            'field_4': 'false', # should not be a string?
            #'field_5': '7777.7777', 
            'field_6': '1',
            'field_7': 'Democrat'
        }

        # now, test PATCH for each new marker (replace)
        for marker_id in mwa_ids:

            # first just check for some pre-existing default data
            marker = models.MarkerWithAttributes.objects.get(id=marker_id)
            self.assertEqual(
                json.loads(marker.geometry.geojson), 
                self.Point
            )

            self.assertEqual(
                marker.description,
                'this is the caption text'
            )

            url = self.list_url + '%s/' % marker_id
            key = posted_data[marker_id][0]
            new_data_item = new_hstore_data_dict[key]
            new_data = {key: new_data_item}

            response = self.client_user.patch(
                    url,
                    data=urllib.urlencode(new_data),
                    HTTP_X_CSRFTOKEN=self.csrf_token,
                    content_type="application/x-www-form-urlencoded")

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            # print(new_data)
            # print(response.data)
            # print('   ')
            # test contains the hstore key/attribute
            self.assertTrue(posted_data[marker_id][0] in response.data)

            # test hstore key/attribute value is correct
            # having to cast to string and make everything lowercase to get matches
            # ...seems like the wrong approach
            self.assertEqual(
                str(response.data[posted_data[marker_id][0]]).lower(), 
                new_data_item.lower())

            # finally, check that other fields have not been replaced (nulled)
            marker = models.MarkerWithAttributes.objects.get(id=marker_id)
            self.assertEqual(marker.description, 'this is the caption text')
            self.assertEqual(response.data['caption'], 'this is the caption text')
            self.assertEqual(json.loads(marker.geometry.geojson), self.Point)
            self.assertEqual(response.data['geometry'], self.Point)
            
            


    def test_something(self):
        self.assertAlmostEqual(1, 1)

    def test_bad_json_update_fails(self, **kwargs):
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
                updated_marker = models.MarkerWithAttributes.objects.get(id=self.markerwattrs.id)
                self.assertEqual(
                    updated_marker.geometry,
                    GEOSGeometry(
                        json.dumps(geom)))

    def test_delete_marker(self, **kwargs):
        marker_id = self.markerwattrs.id
        form_id = self.markerwattrs.form.id

        # ensure marker exists:
        models.MarkerWithAttributes.objects.get(id=marker_id)

        # delete marker:
        response = self.client_user.delete(
            '/api/0/forms/%s/data/%s/' % (form_id, marker_id),
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.MarkerWithAttributes.objects.get(id=marker_id)
            # throw assertion error if marker still in database
            print 'Marker not deleted'
            self.assertEqual(1, 0)
        except models.MarkerWithAttributes.DoesNotExist:
            # trigger assertion success if marker is removed
            self.assertEqual(1, 1)

        def test_child_serializer(self, **kwargs):
            self.photo1 = self.create_photo(self.user, self.project)
            self.audio1 = self.create_audio(self.user, self.project)
            self.create_relation(self.markerwattrs, self.photo1)
            self.create_relation(self.markerwattrs, self.audio1)

            response = self.client_user.get(self.url)
            self.assertEqual(len(response.data['children']['photos']['data']), 1)
            self.assertEqual(len(response.data['children']['audio']['data']), 1)

            # clean up:
            self.delete_relation(self.markerwattrs, self.photo1)
            self.delete_relation(self.markerwattrs, self.audio1)