from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models
from django.contrib.postgres.fields import ArrayField


class NamedMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_named_mixin_model_properties(self):
        from django.contrib.gis.db import models
        from localground.apps.site.models import NamedMixin
        print('ran NamedTests')
        for prop in [
            ('name', models.CharField),
            ('description', models.TextField),
            ('tags', ArrayField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = NamedMixin._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

        
