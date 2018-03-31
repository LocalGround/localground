from localground.apps.site import models
from localground.apps.site.models import Record
from localground.apps.site.managers import MarkerManager
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from localground.apps.site.tests.models import ExtrasMixinTest, \
    PointMixinTest, ProjectMixinTest, NamedMixinTest, \
    GenericRelationMixinTest

from django import test
from django.contrib.contenttypes import generic


class MarkerTests(
    ExtrasMixinTest, PointMixinTest, ProjectMixinTest, NamedMixinTest,
        GenericRelationMixinTest, BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_marker()
        self.object_type = self.model_name = self.pretty_name = 'record'
        self.model_name_plural = self.pretty_name_plural = 'records'

    def test_model_properties(self):
        from django.contrib.gis.db import models
        for prop in [
            ('polyline', models.LineStringField),
            ('polygon', models.PolygonField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Record._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
        test_ff = ('id', 'project', 'tags')
        self.assertEqual(self.model.filter_fields, test_ff)

    def test_geometry(self):
        # could use more thorough tests here
        from django.contrib.gis.geos import Point
        if self.model.point is not None:
            lat = 37.87
            lng = -122.28
            self.assertEqual(self.model.point, Point(lng, lat, srid=4326))

    def test_unicode_(self):
        self.assertEqual(str(self.model.id), self.model.__unicode__())

    def test_check_marker_objects_manager(self):
        self.assertTrue(hasattr(Record, 'objects'))
        self.assertTrue(isinstance(Record.objects, MarkerManager))
