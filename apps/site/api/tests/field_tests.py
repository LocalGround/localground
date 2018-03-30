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
        "form": {'read_only': True, 'required': False, 'type': 'field'},
        'ordering': {'read_only': False, 'required': True, 'type': 'integer'},
        'col_alias': {'read_only': False, 'required': True, 'type': 'string'},
        'extras': {'read_only': False, 'required': False, 'type': 'json'},
        'col_name': {'read_only': True, 'required': False, 'type': 'field'},
        'url': {'read_only': True, 'required': False, 'type': 'field'},
        'id': {'read_only': True, 'required': False, 'type': 'integer'}
    }


class ApiFieldListTest(test.TestCase, FieldTestMixin):
    def setUp(self):
        ViewMixinAPI.setUp(self)
        self.form = self.create_form_with_fields(
                        name="Class Form",
                        num_fields=0
                    )
        self.field1 = self.create_field(self.form, name="Field 1", ordering=1)
        self.field2 = self.create_field(self.form, name="Field 2", ordering=2)
        self.model = models.Field
        self.url = '/api/0/datasets/%s/fields/' % self.form.id
        self.urls = [self.url]
        self.metadata = {
            'data_type': {'read_only': False, 'required': False,
                          'type': 'field'}
        }
        self.metadata.update(get_base_metadata())
        self.view = views.FieldList.as_view()

    def test_reorders_fields_correctly(self, **kwargs):
        self.field3 = self.create_field(self.form, name="Field 3", ordering=4)
        self.field4 = self.create_field(self.form, name="Field 4", ordering=9)
        self.assertEqual(self.field1.ordering, 1)
        self.assertEqual(self.field2.ordering, 2)
        self.assertEqual(self.field3.ordering, 4)
        self.assertEqual(self.field4.ordering, 9)

        response = self.client_user.post(
            self.url,
            data=urllib.urlencode({
                'col_alias': 'Display Name',
                'ordering': 1,
                'do_reshuffle': 1,
                'data_type': 'text'
            }),
            HTTP_X_CSRFTOKEN=self.csrf_token,
            content_type="application/x-www-form-urlencoded"
        )
        i = 1
        for field in self.form.fields:
            self.assertEqual(field.ordering, i)
            i += 1
        self.assertEqual(self.form.fields[0].ordering, 1)
        self.assertEqual(self.form.fields[0].col_alias, 'Display Name')

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
        self.form = self.create_form_with_fields(
                        name="Class Form",
                        num_fields=0
                    )
        self.field = self.create_field(self.form, name="Field 1", ordering=3)
        self.field2 = self.create_field(self.form, name="Field 2", ordering=4)
        self.url = '/api/0/datasets/%s/fields/%s/' % (
            self.field.form.id, self.field.id
        )
        self.url2 = '/api/0/datasets/%s/fields/%s/' % (
            self.field2.form.id, self.field2.id
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
        models.Form.objects.all().delete()

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

    def test_cannot_delete_field_if_only_field_in_form(self, **kwargs):
        # delete all of the fields from the form except for the current field:
        models.Field.objects.filter(
            form=self.form).exclude(id=self.field.id).delete()

        # try to delete the current field (you shouldn't be able to):
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data.get('detail'),
            'Error: This dataset must contain at least 1 field')

    def test_cannot_delete_field_if_used_in_layer_display_field(self):
        map = self.create_styled_map(
            dataset=self.form, display_field=self.field)

        # try to delete the current field (you shouldn't be able to):
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        error_message = 'The following map layers display this field: Oakland '
        error_message += 'Map: Untitled Layer. Please modify the dependent '
        error_message += 'layers\' display fields before deleting this field'
        self.assertEqual(response.data.get('detail'), error_message)

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
        f3 = self.create_field(self.form, name="Field 3", ordering=5)
        f4 = self.create_field(self.form, name="Field 4", ordering=6)
        # delete field 1
        response = self.client_user.delete(
            self.url,
            HTTP_X_CSRFTOKEN=self.csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ordering = 1
        for field in self.form.fields:
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
