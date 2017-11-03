from localground.apps.site import models
from localground.apps.site.models import Layer
from localground.apps.site.models import StyledMap
from django.contrib.auth.models import User
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from django import test
from jsonfield import JSONField


class LayerModelTests(BaseAuditAbstractModelClassTest,test.TestCase):
    def setUp(self):
        from localground.apps.site import models
        BaseAuditAbstractModelClassTest.setUp(self)
        self.model = self.create_layer()
        self.other_user = User.objects.create_user(
            'tester2',
            first_name='test',
            email='',
            password=self.user_password
        )

    
    def test_static_properties(self, **kwargs):
        test_layer_types = (
            ('categorical', 'Category'),
            ('continuous', 'Continuous'),
            ('basic', 'Basic'),
            ('individual', 'Individual Sites')
        )
        self.assertEqual(self.model.LAYER_TYPES, test_layer_types)
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('styled_map', models.ForeignKey),
            ('title', models.CharField),
            ('description', models.TextField),
            ('data_source', models.TextField),
            ('layer_type', models.CharField),
            ('metadata', JSONField),
            ('symbols', JSONField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Layer._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
    
    def test_can_edit(self):
        self.assertTrue(self.model.can_edit(self.user))
        self.assertFalse(self.model.can_edit(self.other_user))
    
    def test_can_view(self):
        # always true, all layers are viewable
        self.assertTrue(self.model.can_view(self.user))
        self.assertTrue(self.model.can_view(self.other_user))
    