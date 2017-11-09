from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from localground.apps.site.models import GenericRelationMixin


class GenericRelationMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_generic_relation_properties(self):
        from django.contrib.gis.db import models
        from django.contrib.contenttypes import fields
        print('ran generic relations tests')
        for prop in [
            ('entities', fields.GenericRelation)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = GenericRelationMixin._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    '''
    def test_gen_rel_grab(self):
    def test_gen_rel_stash(self):
    '''

    

