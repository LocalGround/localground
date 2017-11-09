from localground.apps.site.tests import ModelMixin
from localground.apps.site.models import ExtrasMixin
from jsonfield import JSONField
from django import test
from localground.apps.site import models


class ExtrasMixinTest(ModelMixin):

    def setUp(self):
        ModelMixin.setUp(self)

    def test_extras_model_properties(self):
        print('running extras tests')
        from django.contrib.gis.db import models
        prop_name = 'extras'
        prop_type = JSONField
        field = ExtrasMixin._meta.get_field(prop_name)
        self.assertEqual(field.name, prop_name)
        self.assertEqual(type(field), prop_type)
