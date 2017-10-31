from localground.apps.site.models import TileSet
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class TileSetTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = TileSet()

    '''
    Note - with an emopty Tileset class
    there is no value of the following:
    Overlay Source
    Extras
    '''
    def test_model_properties(self):
        for prop in [
            ('min_zoom', models.IntegerField),
            ('max_zoom', models.IntegerField),
            ('overlay_source', models.ForeignKey),
            ('is_printable', models.BooleanField),
            ('provider_id', models.CharField),
            ('title_url', models.CharField),
            ('static_url', models.CharField),
            ('key', models.CharField),
            ('attribution', models.CharField),
            ('extras', models.JSONField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = self.model._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_to_dict(self, **kwargs):
        testDict = self.model.to_dict()
        print('\n' + testDict)
        self.assertEqual(testDict['id'], None)
        self.assertEqual(testDict['name'], u'')
        self.assertEqual(testDict['source_id'], u'')
        self.assertEqual(testDict['source_name'], u'')
        self.assertEqual(testDict['title_url'], u'')
        self.assertEqual(testDict['static_url'], u'')
        self.assertEqual(testDict['min'], u'')
        self.assertEqual(testDict['max'], u'')
        self.assertEqual(testDict['is_printable'], u'')
