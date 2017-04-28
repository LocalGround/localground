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
            'form': {'read_only': True, 'required': False, 'type': 'field'},
            'ordering': {'read_only': False, 'required': True, 'type': 'integer'},
            'col_alias': {'read_only': False, 'required': True, 'type': 'string'},
            'col_name': {'read_only': True, 'required': False, 'type': 'field'},
            'is_display_field': {'read_only': False, 'required': True, 'type': 'boolean'},
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
        self.url = '/api/0/forms/%s/fields/' % self.form.id
        self.urls = [self.url]
        self.metadata = {
            'data_type': {'read_only': False, 'required': False, 'type': 'field'}
        }
        self.metadata.update(get_base_metadata())
        self.view = views.FieldList.as_view()
        
    def tearDown(self):
        for m in models.Form.objects.all():
            m.remove_table_from_cache()
    
    def test_reorders_fields_correctly(self, **kwargs):
        self.field3 = self.create_field(self.form, name="Field 3", ordering=4)
        self.field4 = self.create_field(self.form, name="Field 4", ordering=9)
        self.assertEqual(self.field1.ordering, 1)
        self.assertEqual(self.field2.ordering, 2)
        self.assertEqual(self.field3.ordering, 4)
        self.assertEqual(self.field4.ordering, 9)

        response = self.client_user.post(self.url,
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
    
    def test_only_one_is_display_field_at_a_time(self, **kwargs):
        self.field3 = self.create_field(self.form, name="Field 3", ordering=3, is_display_field=True)
        self.assertEqual(self.field3.is_display_field, True)
        response = self.client_user.post(self.url,
                        data=urllib.urlencode({
                            'col_alias': 'Display Name',
                            'ordering': 4,
                            'data_type': 'text',
                            'is_display_field': True
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        num_display_fields = 0
        for field in self.form.fields:
            if field.is_display_field:
                self.assertEqual(field.col_alias, 'Display Name')
                num_display_fields += 1
        self.assertEqual(num_display_fields, 1)
        
    def test_create_field_using_post(self, **kwargs):
        response = self.client_user.post(self.url,
                        data=urllib.urlencode({
                            'col_alias': 'Field 3',
                            'ordering': 2,
                            'data_type': 'text'
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        
        if response.status_code != status.HTTP_201_CREATED:
            print response.data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        new_obj = self.model.objects.all().order_by('-id',)[0]
        self.assertEqual(new_obj.col_alias, 'Field 3')
        self.assertEqual(new_obj.col_name, 'field_3')
        
        # also check to see if the new column exists in the Dynamic table
        # and that we can add data to it:
        new_rec = new_obj.form.TableModel()
        new_rec.project = self.project
        new_rec.field_3 = "Testing!!"
        new_rec.save(user=self.user)
        
        same_rec = new_obj.form.TableModel.objects.all().order_by('-id',)[0]
        self.assertEqual(same_rec.field_3, 'Testing!!')
        
    '''
    def test_out_of_bounds_ordering_throws_error_post(self, **kwargs):
        response = self.client_user.post(self.url,
                        data=urllib.urlencode({
                            'col_alias': 'Field 3',
                            'ordering': 20,
                            'data_type': 'text'
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST
    '''
    
    def test_reserved_col_alias_throws_error_post(self, **kwargs):
        for col_alias in ['name', 'caption', 'description', 'display_name', 'tags']:
            response = self.client_user.post(self.url,
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
        self.field = self.create_field(self.form, name="Field 1")
        self.field2 = self.create_field(self.form, name="Field 2")
        self.url = '/api/0/forms/%s/fields/%s/' % (self.field.form.id, self.field.id)
        self.url2 = '/api/0/forms/%s/fields/%s/' % (self.field2.form.id, self.field2.id)
        self.urls = [self.url]
        self.metadata = {
            'data_type': {'read_only': True, 'required': False, 'type': 'field'}
        }
        self.metadata.update(get_base_metadata())
        self.view = views.FieldInstance.as_view()
    
    def tearDown(self):
        models.Form.objects.all().delete()
    
    def test_update_field_using_put(self, **kwargs):
        response = self.client_user.put(self.url,
                        data=urllib.urlencode({
                            'col_alias': 'Address',
                            'ordering': 2
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        #print response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_field = models.Field.objects.get(id=self.field.id)
        self.assertEqual(updated_field.col_alias, 'Address')
        self.assertEqual(updated_field.ordering, 2)

    '''
    def test_out_of_bounds_ordering_throws_error_put(self, **kwargs):
        response = self.client_user.put(self.url,
                        data=urllib.urlencode({
                            'col_alias': 'Field 3',
                            'ordering': 20
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_out_of_bounds_ordering_throws_error_patch(self, **kwargs):
        response = self.client_user.patch(self.url,
                        data=urllib.urlencode({ 'ordering': 20 }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    '''
    
    def test_update_field_using_patch(self, **kwargs):
        response = self.client_user.patch(self.url,
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
        response = self.client_user.patch(self.url2,
                        data=urllib.urlencode({
                            'col_alias': 'Field 1'
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_reserved_col_alias_throws_error_put(self, **kwargs):
        for col_alias in ['id', 'name', 'caption', 'description', 'display_name', 'tags',
                         'owner', 'last_updated_by', 'date_created', 'timestamp']:
            response = self.client_user.put(self.url,
                        data=urllib.urlencode({
                            'col_alias': col_alias,
                            'ordering': 1
                        }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_reserved_col_alias_throws_error_patch(self, **kwargs):
        for col_alias in ['name', 'caption', 'description', 'display_name', 'tags']:
            response = self.client_user.patch(self.url,
                        data=urllib.urlencode({ 'col_alias': col_alias }),
                        HTTP_X_CSRFTOKEN=self.csrf_token,
                        content_type="application/x-www-form-urlencoded"
                    )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_delete_field_reorders_other_fields(self, **kwargs):
        f3 = self.create_field(self.form, name="Field 3", ordering=3)
        f4 = self.create_field(self.form, name="Field 4", ordering=4)
        response = self.client_user.delete(self.url,
                        HTTP_X_CSRFTOKEN=self.csrf_token
                    )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ordering = 1
        for field in self.form.fields:
            self.assertTrue(field.id in [self.field2.id, f3.id, f4.id])
            self.assertEqual(field.ordering, ordering)
            ordering += 1
    
    def test_can_delete(self, **kwargs):
        field_id = self.field.id
        response = self.client_user.delete(self.url,
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
            
            