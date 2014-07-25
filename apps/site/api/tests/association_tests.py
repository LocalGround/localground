from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status


class APIRelatedMediaMixin(object):

    def create_relation(self, entity_type, id=1, ordering=1):
        r = models.GenericAssociation(
            entity_type=entity_type,
            entity_id=id,
            source_type=models.Marker.get_content_type(),
            source_id=self.marker.id,
            ordering=ordering,
            owner=self.user,
            last_updated_by=self.user
        )
        r.save()
        return r


class ApiRelatedMediaListTest(
        test.TestCase,
        ViewMixinAPI,
        APIRelatedMediaMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.marker = self.get_marker()
        url = '/api/0/markers/%s/%s/'
        self.urls = [
            url % (self.marker.id, 'photos'),
            url % (self.marker.id, 'audio')
            #url % (self.marker.id, 'map-images')
        ]
        self.view = views.RelatedMediaList.as_view()

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

            # 1) make sure that no objects are appended to the marker:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                source_type=source_type,
                source_id=self.marker.id,
            )
            self.assertEqual(len(queryset), 0)

            # 2) append object to marker:
            response = self.client_user.post(url, {
                'id': 1,
                'ordering': i
            },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
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
            'id': m1.id,
            'ordering': 1
        },
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        # Cannot attach marker to marker
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ApiRelatedMediaInstanceTest(
        test.TestCase,
        ViewMixinAPI,
        APIRelatedMediaMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.marker = self.get_marker()
        self.create_relation(models.Photo.get_content_type(), id=1)
        self.create_relation(models.Audio.get_content_type(), id=1)
        url = '/api/0/markers/%s/%s/'
        self.urls = [
            url % (self.marker.id, 'photos'),
            url % (self.marker.id, 'audio')
        ]
        self.view = views.RelatedMediaInstance.as_view()

    '''
	def test_page_403_or_302_status_anonymous_user(self):
		url = '/api/0/markers/%s/%s/%s/'
		urls = [
			url % (self.marker.id, 'photos', 1),
			url % (self.marker.id, 'audio', 1)
		]
		ViewMixinAPI.test_page_403_or_302_status_anonymous_user(self, urls=urls)
	'''

    def test_page_200_status_basic_user(self, **kwargs):
        url = '/api/0/markers/%s/%s/%s/'
        urls = [
            url % (self.marker.id, 'photos', 1),
            url % (self.marker.id, 'audio', 1)
        ]
        ViewMixinAPI.test_page_200_status_basic_user(self, urls=urls)

    def test_page_resolves_to_view(self):
        url = '/api/0/markers/%s/%s/%s/'
        urls = [
            url % (self.marker.id, 'photos', 1),
            url % (self.marker.id, 'audio', 1)
        ]
        ViewMixinAPI.test_page_resolves_to_view(self, urls=urls)

    def test_remove_media_from_marker(self, **kwargs):
        '''
        Important note:  the HTTP_X_CSRFTOKEN header must be set for
        a successful delete using Session Authentication
        (had to dig through Django's middleware/csrf.py to sort that out)
        '''
        source_type = models.Marker.get_content_type()
        for i, url in enumerate(self.urls):
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()

            # 0)  Attach media to marker
            entity_id = 2
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

    def test_update_relation_using_put(self, **kwargs):
        '''
        Test Client still a bit idiosyncratic.  Unlike for POST
        requests, for PUT requests, you need to 1) manually set
        the content type (which means that you also have to
        urlencode the params dictionary)
        https://github.com/jgorset/django-respite/issues/38
        '''
        source_type = models.Marker.get_content_type()
        for i, url in enumerate(self.urls):
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()

            # Attach media to marker
            entity_id = 2
            relation = self.create_relation(entity_type, id=entity_id)
            self.assertEqual(relation.ordering, 1)
            self.assertEqual(relation.turned_on, False)
            import urllib
            response = self.client_user.put(
                '%s%s/' %
                (url,
                 entity_id),
                data=urllib.urlencode(
                    {
                        'ordering': 5,
                        'turned_on': True}),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            updated_relation = models.GenericAssociation.objects.get(
                id=relation.id)
            self.assertEqual(updated_relation.ordering, 5)
            self.assertEqual(updated_relation.turned_on, True)

    def test_update_relation_using_patch(self, **kwargs):
        source_type = models.Marker.get_content_type()
        for i, url in enumerate(self.urls):
            entity_type = models.Base.get_model(
                model_name_plural=url.split('/')[-2]
            ).get_content_type()

            # Attach media to marker
            entity_id = 2
            relation = self.create_relation(entity_type, id=entity_id)
            self.assertEqual(relation.turned_on, False)
            import urllib
            response = self.client_user.patch(
                '%s%s/' %
                (url,
                 entity_id),
                data=urllib.urlencode(
                    {
                        'turned_on': True}),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded")
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            updated_relation = models.GenericAssociation.objects.get(
                id=relation.id)
            self.assertEqual(updated_relation.turned_on, True)
