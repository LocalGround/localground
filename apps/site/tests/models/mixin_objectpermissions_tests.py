from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.site.models import ObjectPermissionsMixin
from django.contrib.auth.models import User
from django.contrib.contenttypes import fields


class ObjectPermissionsMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_object_permission_properties(self):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        print('ran object permissions tests')
        for prop in [
            ('access_authority', models.ForeignKey),
            ('access_key', models.CharField),
            ('users', fields.GenericRelation),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = ObjectPermissionsMixin._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_obj_perm_can_view(self):
        self.other_user = User.objects.create_user(
            'tester2',
            first_name='test',
            email='',
            password=self.user_password
        )
        self.assertFalse(self.model.can_view(self.other_user))
        self.assertTrue(self.model.can_view(self.user))

    '''
    def test_obj_perm_can_edit(self):
    def test_obj_perm_can_manage(self):
    '''

    def test_obj_perm_share_url(self):
        test_url = '/profile/{0}/{1}/share/'.format(
            self.model.model_name_plural,
            self.model.id)
        self.assertEqual(self.model.share_url(), test_url)




    
