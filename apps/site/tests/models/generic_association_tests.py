from localground.apps.site import models
from localground.apps.site.models import GenericAssociation
from django.contrib.auth.models import User
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.site.tests.models.abstract_base_tests import \
BaseAbstractModelClassTest

from django import test
from jsonfield import JSONField
from django.contrib.contenttypes import generic


class GenericAssociationModelTests(BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_generic_association()
        self.other_user = User.objects.create_user(
            'tester2',
            first_name='test',
            email='',
            password=self.user_password
        )
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        for prop in [
            ('ordering', models.IntegerField),
            ('turned_on', models.BooleanField),
            ('source_type', models.ForeignKey),
            ('source_id', models.PositiveIntegerField),
            ('source_object', generic.GenericForeignKey),
            ('entity_type', models.ForeignKey),
            ('entity_id', models.PositiveIntegerField),
            ('entity_object', generic.GenericForeignKey),
            ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = GenericAssociation._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
    
    def test_to_dict(self):
        self.model.id = 7777
        self.model.ordering = 1
        self.model.turned_on = True
        test_dict = {
            'username': 7777,
            'ordering': 1,
            'turned_on': True
        }
        self.assertEqual(self.model.to_dict(), test_dict)
    
    def test_can_edit(self):
        self.assertTrue(self.model.can_edit(self.user))
        self.assertFalse(self.model.can_edit(self.other_user))
        
    def test_can_view(self):
        self.assertTrue(self.model.can_view(self.user))
        self.assertFalse(self.model.can_view(self.other_user))