from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status

class ApiRelatedMediaListTest(
        test.TestCase,
        ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        #self.marker = self.get_marker()
        self.marker = self.create_marker(self.user, self.project)
        self.form = self.create_form_with_fields(name="Class Form", num_fields=6)
        #requery:
        self.form = models.Form.objects.get(id=self.form.id)
        self.record = self.insert_form_data_record(form=self.form, project=self.project)
        self.urls = [
            '/api/0/markers/%s/%s/' % (self.marker.id, 'photos'),
            '/api/0/markers/%s/%s/' % (self.marker.id, 'audio'),
            '/api/0/forms/%s/data/%s/%s/' % (self.form.id, self.record.id, 'photos'),
            '/api/0/forms/%s/data/%s/%s/' % (self.form.id, self.record.id, 'audio')
        ]
        self.metadata = {
            "object_id": { "type": "integer", "required": True, "read_only": False },
            "ordering": { "type": "integer", "required": False, "read_only": False },
            "turned_on": {"type": "boolean", "required": False, "read_only": False },
            "relation": { "type": "field", "required": False, "read_only": True }
        }
        self.view = views.RelatedMediaList.as_view()
        
        #create 1 photo and 1 audio object:
        self.photo = self.create_photo(self.user, self.project)
        self.audio = self.create_audio(self.user, self.project)
        
    def tearDown(self):
        for m in models.Form.objects.all():
            m.remove_table_from_cache()
        

    def test_page_404_if_invalid_marker_id(self, **kwargs):
        urls = [
            '/api/0/markers/%s/%s/' % (999, 'photos'),
            '/api/0/markers/%s/%s/' % (999, 'audio'),
            '/api/0/forms/%s/data/%s/%s/' % (self.form.id, 999, 'photos'),
            '/api/0/forms/%s/data/%s/%s/' % (self.form.id, 999, 'audio')
        ]
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_attach_media_to_marker(self, **kwargs):
        for i, url in enumerate(self.urls):
            if "markers" in url:
                source_model = models.Marker
                source_id = self.marker.id
            else:
                source_model = type(self.record)
                source_id = self.record.id

            source_type = source_model.get_content_type()
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()
            
            if entity_type.name == "photo":
                entity_id = self.photo.id
            else:
                entity_id = self.audio.id

            # 1) make sure that no objects are appended to the marker:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                source_type=source_type,
                source_id=source_id,
            )
            self.assertEqual(len(queryset), 0)

            # 2) append object to marker:
            response = self.client_user.post(url, {
                    'object_id': entity_id,
                    'ordering': i
                },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            if response.status_code != status.HTTP_201_CREATED:
                print response.data
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

            # 3) Make sure it's in there:
            # have to re-instantiate the query b/c it's cached:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                source_type=source_type,
                source_id=source_id,
            )
            self.assertEqual(len(queryset), 1)

    def test_cannot_attach_sites_to_sites(self, **kwargs):
        m1 = self.create_marker(self.user, self.project)
        r1 = self.insert_form_data_record(form=self.form, project=self.project)
        source_type = type(self.record).get_content_type()
        
        urls = {
            '/api/0/markers/%s/markers/' % self.marker.id: m1.id,
            '/api/0/forms/%s/data/%s/markers/' % (self.form.id, self.record.id): m1.id,
            '/api/0/markers/%s/%s/' % (self.marker.id, source_type): r1.id,
            '/api/0/forms/%s/data/%s/%s/' % (self.form.id, self.record.id, source_type): r1.id
        }
        for url in urls:
            response = self.client_user.post(url, {
                    'object_id': urls[url],
                    'ordering': 1
                },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            # Cannot attach marker to marker
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ApiRelatedMediaInstanceTest(
        test.TestCase,
        ViewMixinAPI):
    
    
    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        self.marker = self.create_marker(self.user, self.project)
        self.form = self.create_form_with_fields(name="Class Form", num_fields=6)
        #requery:
        self.form = models.Form.objects.get(id=self.form.id)
        self.record = self.insert_form_data_record(form=self.form, project=self.project)
        self.metadata = {
            "ordering": { "type": "integer", "required": False, "read_only": False },
            "turned_on": { "type": "boolean", "required": False, "read_only": False },
            "parent": { "type": "field", "required": False, "read_only": True },
            "child": { "type": "field", "required": False, "read_only": True }
        }
        self.view = views.RelatedMediaInstance.as_view()
        
        # create 2 photo, 2 audio, and 2 relation objecs:
        self.photo1 = self.create_photo(self.user, self.project)
        self.photo2 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.audio2 = self.create_audio(self.user, self.project)
        
        # create urls:
        self.urls = [
            '/api/0/markers/%s/%s/%s/' % (self.marker.id, 'photos', self.photo1.id),
            '/api/0/markers/%s/%s/%s/' % (self.marker.id, 'audio', self.audio1.id),
            '/api/0/forms/%s/data/%s/%s/%s/' % (self.form.id, self.record.id, 'photos', self.photo1.id),
            '/api/0/forms/%s/data/%s/%s/%s/' % (self.form.id, self.record.id, 'audio', self.audio1.id)
        ]
        
        # create associations
        self.create_relation(self.marker, self.photo1)
        self.create_relation(self.marker, self.audio1)
        self.create_relation(self.record, self.photo1)
        self.create_relation(self.record, self.audio1)
        
    def tearDown(self):
        # delete associations:
        self.delete_relation(self.marker, self.photo1)
        self.delete_relation(self.marker, self.audio1)
        self.delete_relation(self.record, self.photo1)
        self.delete_relation(self.record, self.audio1)
        
        # delete custom forms:
        for m in models.Form.objects.all():
            m.remove_table_from_cache()
        
    def test_page_200_status_basic_user(self, **kwargs):
        ViewMixinAPI.test_page_200_status_basic_user(self)

    def test_page_resolves_to_view(self):
        ViewMixinAPI.test_page_resolves_to_view(self)

    def test_remove_media_from_marker(self, **kwargs):
        
        urls = {
            '/api/0/markers/%s/photos/%s/' % (self.marker.id, self.photo1.id): {
                'source_model': self.marker, 'attach_model': self.photo1    
            },
            '/api/0/forms/%s/data/%s/photos/%s/' % (self.form.id, self.record.id, self.photo1.id): {
                'source_model': self.record, 'attach_model': self.photo1    
            },
            '/api/0/markers/%s/audio/%s/' % (self.marker.id, self.audio1.id): {
                'source_model': self.marker, 'attach_model': self.audio1    
            },
            '/api/0/forms/%s/data/%s/audio/%s/' % (self.form.id, self.record.id, self.audio1.id): {
                'source_model': self.record, 'attach_model': self.audio1    
            }
        }
        for url in urls:
            # 1) make sure that the object is appended to the marker:
            source_model = urls[url]['source_model']
            attach_model = urls[url]['attach_model']
            
            #self.create_relation(source_model, attach_model)
        
            queryset = models.GenericAssociation.objects.filter(
                entity_type=type(attach_model).get_content_type(),
                entity_id=attach_model.id,
                source_type=type(source_model).get_content_type(),
                source_id=source_model.id
            )
            self.assertEqual(len(queryset), 1)

            # 2) remove object from marker:
            response = self.client_user.delete(url, HTTP_X_CSRFTOKEN=self.csrf_token)

            # print response.content
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # 3) ensure object has been removed from the marker:
            # have to re-instantiate the query b/c it's cached:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=type(attach_model).get_content_type(),
                entity_id=attach_model.id,
                source_type=type(source_model).get_content_type(),
                source_id=source_model.id
            )
            self.assertEqual(len(queryset), 0)
            
    def _test_using_put_or_patch(self, f, params, **kwargs):
        urls = {
            '/api/0/markers/%s/photos/%s/' % (self.marker.id, self.photo1.id): {
                'source_model': self.marker, 'attach_model': self.photo1    
            },
            '/api/0/forms/%s/data/%s/photos/%s/' % (self.form.id, self.record.id, self.photo1.id): {
                'source_model': self.record, 'attach_model': self.photo1    
            },
            '/api/0/markers/%s/audio/%s/' % (self.marker.id, self.audio1.id): {
                'source_model': self.marker, 'attach_model': self.audio1    
            },
            '/api/0/forms/%s/data/%s/audio/%s/' % (self.form.id, self.record.id, self.audio1.id): {
                'source_model': self.record, 'attach_model': self.audio1    
            }
        }
        for url in urls:
            # 1) make sure that the object is appended to the marker:
            source_model = urls[url]['source_model']
            attach_model = urls[url]['attach_model']
        
            relation = self.get_relation(source_model, attach_model)
                
            self.assertEqual(relation.ordering, 1)
            self.assertEqual(relation.turned_on, False)
            import urllib
            response = f(
                url,
                data=urllib.urlencode(params),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            updated_relation = models.GenericAssociation.objects.get(id=relation.id)
            
            #check that values have been updated:
            for key in params.keys():
                self.assertEqual(getattr(updated_relation, key), params[key])
        

    def test_update_relation_using_put(self, **kwargs):
        self._test_using_put_or_patch(
            self.client_user.put,
            { 'ordering': 5, 'turned_on': True },
            **kwargs
        )
        

    def test_update_relation_using_patch(self, **kwargs):
        self._test_using_put_or_patch(
            self.client_user.patch,
            { 'turned_on': True },
            **kwargs
        )
