from localground.apps.site.models import TileSet
from django.conf import settings
from django.contrib.gis.db import models
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


class TileSetTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = TileSet.objects.get(id=1)

    '''
    There is no value of the following:
    Extras
    '''
    def test_model_properties(self):
        for prop in [
            ('min_zoom', models.IntegerField),
            ('max_zoom', models.IntegerField),
            ('overlay_source', models.ForeignKey),
            ('is_printable', models.BooleanField),
            ('provider_id', models.CharField),
            ('tile_url', models.CharField),
            ('static_url', models.CharField),
            ('key', models.CharField),
            ('attribution', models.CharField),
            # ('extras', models.JSONField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = self.model._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_to_dict(self, **kwargs):
        testDict = self.model.to_dict()
        self.assertEqual(testDict['id'], 1)
        self.assertEqual(testDict['name'], u'Grayscale')
        self.assertEqual(testDict['source_id'], 1)
        self.assertEqual(testDict['source_name'], u'mapbox')
        self.assertEqual(testDict['tile_url'], u'https://api.mapbox.com/styles/v1/lg/cj176x4e400252sk86yda5omv/tiles/256/{z}/{x}/{y}')
        self.assertEqual(testDict['static_url'], u'https://api.mapbox.com/styles/v1/lg/cj176yj2k001t2spk3cjy6j8m/static/{x},{y},{z},0.00,0.00/{w}x{h}')
        self.assertEqual(testDict['min'], 1)
        self.assertEqual(testDict['max'], 20)
        self.assertEqual(testDict['is_printable'], True)
