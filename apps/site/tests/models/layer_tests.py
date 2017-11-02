from localground.apps.site import models
from localground.apps.site.models import Layer
from localground.apps.site.models import StyledMap
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from django import test
from jsonfield import JSONField


class LayerModelTests(test.TestCase):
    def setUp(self):
        self.model = Layer()
    
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

    def test_Meta(self):
        self.assertTrue(hasattr(self.model.Meta, 'app_label'))
        #self.assertTrue(hasattr(self.model.Meta, 'unique_together'))
        self.assertEqual(self.model.Meta.app_label, 'site')
        '''
        self.assertEqual(
            self.model.Meta.unique_together, ('title', 'styled_map')
        )
        '''
    
    '''
    # need to properly mock a 'StyledMap' in order to test this
    def test_can_edit(self):
        map = StyledMap()
        map.save() #needs to be saved to the database with non-null attributes?
        self.model.user = 'test_user'
        other_user = 'other_user'
        self.model.styled_map = map 

        self.assertTrue(self.model.can_edit(self.model.user))
        self.assertFalse(self.model.can_edit(other_user))
    '''