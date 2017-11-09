from localground.apps.site.models import ObjectAuthority, \
    UserAuthority, UserAuthorityObject
from localground.apps.site.tests.models.abstract_base_tests import \
BaseAbstractModelClassTest
from django.contrib.contenttypes import fields
from django import test


class ObjectAuthorityTest(test.TestCase):
    def setUp(self):
        self.model = ObjectAuthority()
        self.object_type = self.model_name = self.pretty_name = 'object_authority'
        self.model_name_plural = self.pretty_name_plural = 'object_authorities'
        
    def test_static_properties(self, **kwargs):
        #self.objAuth = ObjectAuthority()
        self.assertEqual(self.model.PRIVATE, 1)
        self.assertEqual(self.model.PUBLIC_WITH_LINK, 2)
        self.assertEqual(self.model.PUBLIC, 3)
    
    
    def test_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('name', models.CharField),
            ('description', models.CharField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = ObjectAuthority._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
    
    def test_unicode_(self):
        self.model.name = 'Tester'
        self.assertEqual(self.model.__unicode__(), 'Tester')

class UserAuthorityTests(test.TestCase):
    def setUp(self):
        self.model = UserAuthority()
        self.object_type = self.model_name = self.pretty_name = 'user_authority'
        self.model_name_plural = self.pretty_name_plural = 'user_authorities'
    
    def test_static_properties(self, **kwargs):
        self.assertEqual(self.model.CAN_VIEW, 1)
        self.assertEqual(self.model.CAN_EDIT, 2)
        self.assertEqual(self.model.CAN_MANAGE, 3)
    
    def test_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
            
        field = UserAuthority._meta.get_field('name')
        self.assertEqual(field.name, 'name')
        self.assertEqual(type(field), models.CharField)
    
    def test_unicode_(self):
        self.model.name = 'Tester'
        self.assertEqual(self.model.__unicode__(), 'Tester')

        
class UserAuthorityObjectTests(BaseAbstractModelClassTest, 
    test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = UserAuthorityObject()
        self.object_type = self.model_name = self.pretty_name = 'user authority object'
        self.model_name_plural = self.pretty_name_plural = 'user authority objects'
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        for prop in [
            ('user', models.ForeignKey),
            ('authority', models.ForeignKey),
            ('time_stamp', models.DateTimeField),
            ('granted_by', models.ForeignKey),
            ('content_type', models.ForeignKey),
            ('object_id', models.PositiveIntegerField),
            ('object', fields.GenericForeignKey),
            ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = UserAuthorityObject._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
    
    
    # how to test this???
    def test_to_dict(self):
        self.model.auth_user = {'username': 'tester_person'}
        #self.model.auth_user.username = "tester_person"
        self.model.authority.id = 777
        self.authority.name = 'Tester'

        test_dict = {
            'username': 'tester_person',
            'authority_id': 777,
            'authority': 'Tester'
        }

        self.assertEqual(self.model.to_dict(), test_dict)
    



