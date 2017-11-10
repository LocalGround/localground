from localground.apps.site import models
from localground.apps.site.models import StyledMap
from localground.apps.site.managers import StyledMapManager
from localground.apps.site.tests.models.abstract_base_tests import \
BaseAbstractModelClassTest
from localground.apps.site.tests.models import \
    BaseAuditAbstractModelClassTest, NamedMixinTest, \
    ProjectMixinTest 

from django import test
from django.contrib.contenttypes import generic
from jsonfield import JSONField


class StyledMapTests(NamedMixinTest, ProjectMixinTest, BaseAbstractModelClassTest, test.TestCase):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_styled_map()
        self.object_type = self.model_name = self.pretty_name = 'styled_map'
        self.model_name_plural = self.pretty_name_plural = 'styled_maps'
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        for prop in [
            ('center', models.PointField),
            ('zoom', models.IntegerField),
            ('panel_styles', JSONField),
            ('slug', models.SlugField),
            ('basemap', models.ForeignKey),
            ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = StyledMap._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
        test_ff = ('id', 'date_created', 'time_stamp', 'owner', 'slug', 'name', 'description', 'tags', 'owner', 'project')
        self.assertEqual(self.model.filter_fields, test_ff)


    '''
    StyledMap overrides the ProjectMixin's can_view() method.
    Therefore, we will override and skip ProjectMixinTests's  
    'test_project_can_view_method()' test and instead write a new can_view() 
    test for StyledMapTest
    '''
    def test_project_can_view_method(self):
        pass

    def test_can_view(self):
        self.model.user = 'anybody'
        self.assertTrue(self.model.can_view(self.model.user))
    
    def test_str_(self):
        #self.model.name = 'map34'
        self.assertEqual(self.model.__str__(), 'Oakland Map')

    def test_check_styled_map_objects_manager(self, **kwargs):
        self.assertTrue(hasattr(StyledMap, 'objects'))
        self.assertTrue(isinstance(StyledMap.objects, StyledMapManager))