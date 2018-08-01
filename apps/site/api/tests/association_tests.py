from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI
from rest_framework import status
import urllib


class ApiRelatedMediaListTest(test.TestCase, ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        self.dataset = self.create_dataset_with_fields(
            name="Class Dataset", num_fields=7)
        # requery:
        self.dataset = models.Dataset.objects.get(id=self.dataset.id)
        self.record = self.create_record(
            self.user, self.project, dataset=self.dataset)

        # self.record = self.insert_dataset_data_record(
        #                 dataset=self.dataset, project=self.project
        #             )
        self.urls = [
            '/api/0/datasets/%s/data/%s/%s/' % (
                self.dataset.id, self.record.id, 'photos'
            ),
            '/api/0/datasets/%s/data/%s/%s/' % (
                self.dataset.id, self.record.id, 'audio'
            )
        ]
        self.metadata = {
            "object_id": {"type": "integer", "required": True,
                          "read_only": False},
            "ordering": {"type": "integer", "required": False,
                         "read_only": True},
            "relation": {"type": "field", "required": False, "read_only": True}
        }
        self.view = views.RelatedMediaList.as_view()

        # create 1 photo and 1 audio object:
        self.photo = self.create_photo(self.user, self.project)
        self.audio = self.create_audio(self.user, self.project)

    def test_page_404_if_invalid_record_id(self, **kwargs):
        urls = [
            '/api/0/datasets/%s/data/%s/%s/' % (self.dataset.id, 999, 'photos'),
            '/api/0/datasets/%s/data/%s/%s/' % (self.dataset.id, 999, 'audio')
        ]
        for url in urls:
            response = self.client_user.get(url)
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_attach_media_to_record(self, **kwargs):
        for i, url in enumerate(self.urls):
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

            # 1) make sure that no objects are appended to the record:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=entity_type,
                source_type=source_type,
                source_id=source_id,
            )
            self.assertEqual(len(queryset), 0)

            # 2) append object to record:
            response = self.client_user.post(url, {
                    'object_id': entity_id,
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
                source_id=source_id,
            )
            self.assertEqual(len(queryset), 1)

    def test_cannot_attach_sites_to_sites(self, **kwargs):
        mwa1 = self.record = self.create_record(
            self.user, self.project, dataset=self.dataset)
        source_type = 'audio'

        urls = {
            '/api/0/datasets/%s/data/%s/%s/' % (
                self.dataset.id, self.record.id, source_type
            ): mwa1.id
        }
        for url in urls:
            response = self.client_user.post(url, {
                    'object_id': urls[url],
                    'ordering': 1
                },
                HTTP_X_CSRFTOKEN=self.csrf_token
            )
            # Cannot attach record to record
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ApiRelatedMediaInstanceTest(
        test.TestCase,
        ViewMixinAPI):

    def setUp(self):
        ViewMixinAPI.setUp(self, load_fixtures=False)
        self.dataset = self.create_dataset_with_fields(
            name="Class Dataset", num_fields=7
        )
        # requery:
        self.dataset = models.Dataset.objects.get(id=self.dataset.id)
        self.record = self.create_record(self.user, self.project, dataset=self.dataset)
        # self.record = self.insert_dataset_data_record(
        #     dataset=self.dataset, project=self.project
        # )
        self.metadata = {
            "ordering": {"type": "integer", "required": False,
                         "read_only": False},
            "parent": {"type": "field", "required": False, "read_only": True},
            "child": {"type": "field", "required": False, "read_only": True}
        }
        self.view = views.RelatedMediaInstance.as_view()

        # create 2 photo, 2 audio, and 2 relation objecs:
        self.photo1 = self.create_photo(self.user, self.project)
        self.photo2 = self.create_photo(self.user, self.project)
        self.audio1 = self.create_audio(self.user, self.project)
        self.audio2 = self.create_audio(self.user, self.project)

        # create associations
        self.create_relation(self.record, self.photo1, ordering=1)
        self.create_relation(self.record, self.photo2, ordering=2)
        self.create_relation(self.record, self.audio1, ordering=1)
        self.create_relation(self.record, self.audio2, ordering=2)

        # create urls:
        base_url = '/api/0/datasets/%s/data/%s/%s/%s/'
        ds_id = self.dataset.id
        r_id = self.record.id
        self.url_p1 = base_url % (ds_id, r_id, 'photos', self.photo1.id)
        self.url_p2 = base_url % (ds_id, r_id, 'photos', self.photo2.id)
        self.url_a1 = base_url % (ds_id, r_id, 'audio', self.audio1.id)
        self.url_a2 = base_url % (ds_id, r_id, 'audio', self.audio2.id)
        self.urls = [self.url_p1, self.url_p2, self.url_a1, self.url_a2]

    def tearDown(self):
        # delete associations:
        self.delete_relation(self.record, self.photo1)
        self.delete_relation(self.record, self.audio1)

    def test_page_200_status_basic_user(self, **kwargs):
        ViewMixinAPI.test_page_200_status_basic_user(self)

    def test_page_resolves_to_view(self):
        ViewMixinAPI.test_page_resolves_to_view(self)

    def test_remove_media_from_record(self, **kwargs):

        urls = {
            '/api/0/datasets/%s/data/%s/photos/%s/' % (
                self.dataset.id, self.record.id, self.photo1.id
            ): {
                'source_model': self.record, 'attach_model': self.photo1
            },
            '/api/0/datasets/%s/data/%s/audio/%s/' % (
                self.dataset.id, self.record, self.audio1.id
            ): {
                'source_model': self.record, 'attach_model': self.audio1
            }
        }
        for url in urls:
            # 1) make sure that the object is appended to the record:
            source_model = urls[url]['source_model']
            attach_model = urls[url]['attach_model']

            # self.create_relation(source_model, attach_model)

            queryset = models.GenericAssociation.objects.filter(
                entity_type=type(attach_model).get_content_type(),
                entity_id=attach_model.id,
                source_type=type(source_model).get_content_type(),
                source_id=source_model.id
            )
            self.assertEqual(len(queryset), 1)

            # 2) remove object from record:
            response = self.client_user.delete(
                url, HTTP_X_CSRFTOKEN=self.csrf_token
            )

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # 3) ensure object has been removed from the record:
            # have to re-instantiate the query b/c it's cached:
            queryset = models.GenericAssociation.objects.filter(
                entity_type=type(attach_model).get_content_type(),
                entity_id=attach_model.id,
                source_type=type(source_model).get_content_type(),
                source_id=source_model.id
            )
            self.assertEqual(len(queryset), 0)

    def test_update_relation_using_put(self, **kwargs):
        relation = self.get_relation(self.record, self.photo1)
        self.assertEqual(relation.ordering, 1)
        response = self.client_user.put(
            self.url_p1,
            data=urllib.urlencode({'ordering': 5}),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        relation = self.get_relation(self.record, self.photo1)
        self.assertEqual(relation.ordering, 2)

    def test_update_relation_using_patch(self, **kwargs):
        relation = self.get_relation(self.record, self.audio1)
        self.assertEqual(relation.ordering, 1)
        response = self.client_user.patch(
            self.url_a1,
            data=urllib.urlencode({'ordering': 5}),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        relation = self.get_relation(self.record, self.audio1)
        self.assertEqual(relation.ordering, 2)

    def test_reordering_one_reorders_them_all_put(self, **kwargs):
        counter = 1
        response = self.client_user.patch(
            self.url_a1,
            data=urllib.urlencode({'ordering': 2}),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        p1_relation = self.get_relation(self.record, self.photo1)
        self.assertEqual(p1_relation.ordering, 1)

        a1_relation = self.get_relation(self.record, self.audio1)
        self.assertEqual(a1_relation.ordering, 2)

        a2_relation = self.get_relation(self.record, self.audio2)
        self.assertEqual(a2_relation.ordering, 1)

        p2_relation = self.get_relation(self.record, self.photo2)
        self.assertEqual(p2_relation.ordering, 2)
