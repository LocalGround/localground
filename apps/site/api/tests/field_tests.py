from django import test
from localground.apps.site.api import views
from localground.apps.site import models
from localground.apps.site.api.tests.base_tests import ViewMixinAPI

import urllib
from rest_framework import status


class FieldTestMixin(ViewMixinAPI):
    pass


def get_base_metadata():
    return {
        "dataset": {'read_only': True, 'required': False, 'type': 'field'},
        'ordering': {'read_only': False, 'required': True, 'type': 'integer'},
        'col_alias': {'read_only': False, 'required': True, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
        'col_name': {'read_only': True, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'},
        'key': {'read_only': True, 'required': False, 'type': 'field'}
    }


class ApiFieldListTest(test.TestCase, FieldTestMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.dataset = self.create_dataset_with_fields(
                        name="Class Dataset",
                        num_fields=0
                    )
        self.field1 = self.create_field(self.dataset, name="Field 1", ordering=1)
        self.field2 = self.create_field(self.dataset, name="Field 2", ordering=2)
        self.model = models.Field
        self.url = '/api/0/datasets/%s/fields/' % self.dataset.id
        self.urls = [self.url]
        self.metadata = {
            'data_type': {'read_only': False, 'required': False,
                          'type': 'field'}
        }
        self.metadata.update(get_base_metadata())
        self.view = views.FieldList.as_view()

    def test_reorders_fields_correctly(self, **kwargs):
        self.field3 = self.create_field(self.dataset, name="Field 3", ordering=4)
        self.field4 = self.create_field(self.dataset, name="Field 4", ordering=9)
        self.assertEqual(self.field1.ordering, 1)
        self.assertEqual(self.field2.ordering, 2)
        self.assertEqual(self.field3.ordering, 4)
        self.assertEqual(self.field4.ordering, 9)

        response = self.client_user.post(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'Display Name',
                'ordering': 1,
                'data_type': 'text'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        i = 1
        for field in self.dataset.fields:
            self.assertEqual(field.ordering, i)
            i += 1
        self.assertEqual(self.dataset.fields[0].ordering, 1)
        self.assertEqual(self.dataset.fields[0].col_alias, 'Display Name')

    def test_create_field_using_post(self, **kwargs):
        response = self.client_user.post(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'Field 3',
                'ordering': 2,
                'data_type': 'text'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_obj = self.model.objects.all().order_by('-id',)[0]
        self.assertEqual(new_obj.col_alias, 'Field 3')
        self.assertEqual(new_obj.col_name, 'field_3')

    def test_reserved_col_alias_throws_error_post(self, **kwargs):
        for col_alias in [
            'name', 'caption', 'description', 'display_name', 'tags'
        ]:
            response = self.client_user.post(
                self.url,
                data=urllib.urlencode({
                    'col_alias': col_alias,
                    'ordering': 1,
                    'data_type': 'text'
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ApiFieldInstanceTest(test.TestCase, FieldTestMixin):

    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.dataset = self.create_dataset_with_fields(
                        name="Class Dataset",
                        num_fields=0
                    )
        self.field = self.create_field(self.dataset, name="Field 1", ordering=3)
        self.field2 = self.create_field(self.dataset, name="Field 2", ordering=4)
        self.url = '/api/0/datasets/%s/fields/%s/' % (
            self.field.dataset.id, self.field.id
        )
        self.url2 = '/api/0/datasets/%s/fields/%s/' % (
            self.field2.dataset.id, self.field2.id
        )
        self.urls = [self.url]
        self.metadata = {
            'data_type': {
                'read_only': True, 'required': False, 'type': 'field'
            }
        }
        self.metadata.update(get_base_metadata())
        self.view = views.FieldInstance.as_view()

    def tearDown(self):
        models.StyledMap.objects.all().delete()
        models.Dataset.objects.all().delete()

    def test_update_field_using_put(self, **kwargs):
        response = self.client_user.put(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'Address',
                'ordering': 2
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_field = models.Field.objects.get(id=self.field.id)
        self.assertEqual(updated_field.col_alias, 'Address')
        self.assertEqual(updated_field.ordering, 2)

    def test_update_field_using_patch(self, **kwargs):
        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'Address 1'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_field = models.Field.objects.get(id=self.field.id)
        self.assertEqual(updated_field.col_alias, 'Address 1')

    def test_no_columns_same_name(self, **kwargs):
        response = self.client_user.patch(
            self.url2,
            data=urllib.urlencode({
                'col_alias': 'Field 1'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reserved_col_alias_throws_error_put(self, **kwargs):
        for col_alias in [
            'id', 'name', 'caption', 'description', 'display_name', 'tags',
                'owner', 'last_updated_by', 'date_created', 'timestamp']:
            response = self.client_user.put(
                self.url,
                data=urllib.urlencode({
                    'col_alias': col_alias,
                    'ordering': 1
                }),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_delete_field_if_only_field_in_dataset(self, **kwargs):
        # delete all of the fields from the dataset except for the current field:
        models.Field.objects.filter(
            dataset=self.dataset).exclude(id=self.field.id).delete()

        # try to delete the current field (you shouldn't be able to):
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data[0],
            'Error: This dataset must contain at least 1 field')

    def test_cannot_delete_field_if_used_in_layer_display_field(self):
        map = self.create_styled_map(dataset=self.dataset)
        layer = self.create_layer(
            map, dataset=self.dataset, display_field=self.field)

        # try to delete the current field (you shouldn't be able to):
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        error_message = 'This field cannot be deleted because dependencies '
        error_message += 'have been detected.'
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('dependencies')[0],
            u'Test Project > Oakland Map > Untitled Layer')
        self.assertEqual(
            response.data.get('error_message'), error_message)

    def test_cannot_delete_field_if_used_in_symbol_rule(self):
        map = self.create_styled_map(dataset=self.dataset)
        field_rule = '{0} = red'.format(self.field2.col_name_db)
        symbols = [
            models.Symbol(rule=field_rule).to_dict()
        ]
        layer = self.create_layer(
            map, symbols=symbols, dataset=self.dataset,
            display_field=self.field, title='Field Layer')

        # try to delete the current field (you shouldn't be able to):
        response = self.client_user.delete(
            self.url2,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('dependencies')[0],
            u'Test Project > Oakland Map > Field Layer')
        self.assertEqual(
            response.data.get('error_message'),
            u'This field cannot be deleted because dependencies have been detected.')

    def test_reserved_col_alias_throws_error_patch(self, **kwargs):
        for col_alias in [
            'name', 'caption', 'description', 'display_name', 'tags'
        ]:
            response = self.client_user.patch(
                self.url,
                data=urllib.urlencode({'col_alias': col_alias}),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_field_reorders_other_fields(self, **kwargs):
        f3 = self.create_field(self.dataset, name="Field 3", ordering=5)
        f4 = self.create_field(self.dataset, name="Field 4", ordering=6)
        # delete field 1
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ordering = 1
        for field in self.dataset.fields:
            # print field.id, field.col_alias, field.ordering, ordering
            self.assertEqual(field.ordering, ordering)
            ordering += 1

    def test_can_delete(self, **kwargs):
        field_id = self.field.id
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # check to make sure it's gone:
        try:
            models.Field.objects.get(id=field_id)
            # throw assertion error if photo still in database
            print 'Field not deleted'
            self.assertEqual(1, 0)
        except models.Field.DoesNotExist:
            # trigger assertion success if photo is removed
            self.assertEqual(1, 1)

    def test_rename_fields_does_not_kill_record_values(self):
        record_url = '/api/0/datasets/{0}/data/?project_id={1}'.format(
            self.dataset.id, self.project.id)
        project_id = self.project.id
        values = [
            {'field_1': 'moist', 'field_2': 'text', 'project_id': project_id},
            {'field_1': 'wet', 'field_2': 'blah', 'project_id': project_id},
            {'field_1': 'dry', 'field_2': 'text', 'project_id': project_id},
        ]
        # create three records:
        for d in values:
            response = self.client_user.post(
                record_url,
                data=urllib.urlencode(d),
                HTTP_X_CSRFTOKEN=self.csrf_token,
                content_type="application/x-www-form-urlencoded"
            )

        # now get the records:
        response = self.client_user.get(
            record_url
        )
        data = response.data.get('results')
        self.assertEqual(data[0].get('field_1'), 'moist')
        self.assertEqual(data[1].get('field_1'), 'wet')
        self.assertEqual(data[2].get('field_1'), 'dry')

        response = self.client_user.patch(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'soil moisture'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        # now get the records (again):
        response = self.client_user.get(
            record_url
        )
        data = response.data.get('results')
        self.assertEqual(data[0].get('soil_moisture'), 'moist')
        self.assertEqual(data[1].get('soil_moisture'), 'wet')
        self.assertEqual(data[2].get('soil_moisture'), 'dry')
