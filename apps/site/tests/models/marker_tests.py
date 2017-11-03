from localground.apps.site import models
from localground.apps.site.models import Marker
from localground.apps.site.tests.models.abstract_base_uploaded_media_tests \
    import BaseUploadedMediaAbstractModelClassTest
from localground.apps.site.tests.models.abstract_base_tests import \
BaseAbstractModelClassTest

from django import test
from django.contrib.contenttypes import generic


class GenericAssociationModelTests(BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_marker()
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        for prop in [
            ('polyline', models.LineStringField),
            ('polygon', models.PolygonField),
            ('color', models.CharField)
            ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Marker._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
        test_ff = ('id', 'project', 'name', 'description', 'tags',)
        self.assertEqual(self.model.filter_fields, test_ff)
    
    def test_geometry(self):
        # could use more thorough tests here
        from django.contrib.gis.geos import Point
        if self.model.point != None:
            lat = 37.87
            lng = -122.28
            self.assertEqual(self.model.point, Point(lng, lat, srid=4326))
    
    def test_get_name(self):
        self.assertEqual(self.model.get_name(), 'Marker Test')

        # test if no name exists
        self.model.name = None
        self.assertEqual(self.model.get_name(), 'Marker #%s' % (self.model.id))

    def test_create_instance(self):
        user = self.user
        project = self.project
        lat = 37.87
        lng = -122.28
        name = 'Marker 1'
        new_marker = Marker.create_instance(
            user, project, lat, lng, name
        )
        self.assertTrue(new_marker.pk)
        self.assertTrue(new_marker.point)
        self.assertEqual(new_marker.color, 'CCCCCC')
        self.assertEqual(new_marker.project, self.model.project)
        self.assertEqual(new_marker.owner, self.model.owner)

    def test_unicode_(self):
        self.assertEqual(str(self.model.id), self.model.__unicode__())