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
        url = '/api/0/markers/%s/%s/'
        self.urls = [
            url % (self.marker.id, 'photos'),
            url % (self.marker.id, 'audio')
            #url % (self.marker.id, 'map-images')
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
        

    def test_page_404_if_invalid_marker_id(self, **kwargs):
        url = '/api/0/markers/%s/%s/'
        urls = [
            url % (999, 'photos'),
            url % (999, 'audio')
        ]
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_attach_media_to_marker(self, **kwargs):
        source_type = models.Marker.get_content_type()
        for i, url in enumerate(self.urls):
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
                source_id=self.marker.id,
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
                source_id=self.marker.id,
            )
            self.assertEqual(len(queryset), 1)

    def test_cannot_attach_marker_to_marker(self, **kwargs):
        m1 = self.create_marker(self.user, self.project)
        url = '/api/0/markers/%s/markers/' % self.marker.id
        response = self.client_user.post(url, {
            'object_id': m1.id,
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
        self.create_relation(models.Photo.get_content_type(), id=self.photo1.id, ordering=1)
        self.create_relation(models.Audio.get_content_type(), id=self.audio1.id, ordering=1)
        
        # create urls:
        url = '/api/0/markers/%s/%s/%s/'
        self.urls = [
            url % (self.marker.id, 'photos', self.photo1.id),
            url % (self.marker.id, 'audio', self.audio1.id)
        ]
        
        
    def test_page_200_status_basic_user(self, **kwargs):
        url = '/api/0/markers/%s/%s/%s/'
        urls = [
            url % (self.marker.id, 'photos', self.photo1.id),
            url % (self.marker.id, 'audio', self.audio1.id)
        ]
        ViewMixinAPI.test_page_200_status_basic_user(self, urls=urls)

    def test_page_resolves_to_view(self):
        url = '/api/0/markers/%s/%s/%s/'
        urls = [
            url % (self.marker.id, 'photos', self.photo1.id),
            url % (self.marker.id, 'audio', self.audio1.id)
        ]
        ViewMixinAPI.test_page_resolves_to_view(self, urls=urls)

    def test_remove_media_from_marker(self, **kwargs):
        '''
        Important note:  the HTTP_X_CSRFTOKEN header must be set for
        a successful delete using Session Authentication
        (had to dig through Django's middleware/csrf.py to sort that out)
        '''
        source_type = models.Marker.get_content_type()
        url = '/api/0/markers/%s/%s/'
        for i, url in enumerate([ url % (self.marker.id, 'photos'), url % (self.marker.id, 'audio') ]):
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()

            # 0)  Attach media to marker
            entity_id = self.photo2.id
            self.create_relation(entity_type, id=entity_id)

            # 1) make sure that the object is appended to the marker:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                entity_id=entity_id,
                source_type=source_type,
                source_id=self.marker.id,
            )
            self.assertEqual(len(queryset), 1)

            # 2) remove object from marker:
            response = self.client_user.delete('%s%s/' % (url, entity_id),
                                               HTTP_X_CSRFTOKEN=self.csrf_token
                                               )
            # print response.content
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # 3) ensure object has been removed from the marker:
            # have to re-instantiate the query b/c it's cached:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                entity_id=entity_id,
                source_type=source_type,
                source_id=self.marker.id,
            )
            self.assertEqual(len(queryset), 0)
            
    def _test_using_put_or_patch(self, f, params, **kwargs):
        source_type = models.Marker.get_content_type()
        url = '/api/0/markers/%s/%s/'
        for i, url in enumerate([ url % (self.marker.id, 'photos'), url % (self.marker.id, 'audio') ]):
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()

            # Attach media to marker
            if entity_type.name == "photo":
                entity_id = self.photo2.id
            else:
                entity_id = self.audio2.id
                
            relation = self.create_relation(entity_type, id=entity_id)
            self.assertEqual(relation.ordering, 1)
            self.assertEqual(relation.turned_on, False)
            import urllib
            url = '%s%s/' % (url, entity_id)
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
