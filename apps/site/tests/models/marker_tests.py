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
        
        '''
        # test if no name exists?
        # problem: marker has no 'id' to fall back on
        self.model.name = None
        self.assertEqual(self.model.get_name(), self.model.id)
        '''
    
    #def test_get_records(self):
    # need to create forms to make this work?

    #def test_get_form_ids(self):

    

    #def test_create_instance(self):

    #def test_can_edit()
    #def test_can_view()