from localground.apps.site import models
from localground.apps.site.models import StyledMap, Dataset, Layer
from localground.apps.site.managers import StyledMapManager
from localground.apps.site.tests.models.abstract_base_tests import \
BaseAbstractModelClassTest
from localground.apps.site.tests.models import \
    BaseAuditAbstractModelClassTest, NamedMixinTest, \
    ProjectMixinTest
from django.contrib.gis.geos import GEOSGeometry
import uuid
from django import test
from jsonfield import JSONField


class StyledMapTests(
        NamedMixinTest, ProjectMixinTest, BaseAbstractModelClassTest,
        test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = self.create_styled_map()
        self.object_type = self.model_name = self.pretty_name = 'styled_map'
        self.model_name_plural = self.pretty_name_plural = 'styled_maps'

    def get_kwargs(self):
        return {
            'center': GEOSGeometry('POINT(5 23)'),
            'tags': [],
            'description': '',
            'zoom': 4,
            'project': self.project,
            'last_updated_by': self.user,
            'owner': self.user,
            'slug': uuid.uuid4().hex,
            'name': 'My Test Map'
        }

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
        test_ff = (
            'id', 'date_created', 'time_stamp', 'owner', 'slug', 'name',
            'description', 'tags', 'owner', 'project')
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
        self.assertEqual(self.model.__str__(), 'Oakland Map')

    def test_check_styled_map_objects_manager(self, **kwargs):
        self.assertTrue(hasattr(StyledMap, 'objects'))
        self.assertTrue(isinstance(StyledMap.objects, StyledMapManager))

    def test_create_map_new_dataset(self, **kwargs):
        num_datasets = len(Dataset.objects.all())
        map = StyledMap.create(**self.get_kwargs())

        # Check that a new layer has been added:
        self.assertEqual(len(map.layers), 1)

        # Check that a new dataset has been create:
        self.assertEqual(num_datasets + 1, len(Dataset.objects.all()))

    def test_delete_map_removes_orphaned_empty_datasets(self, **kwargs):
        num_datasets = len(Dataset.objects.all())
        map = StyledMap.create(**self.get_kwargs())
        # Check that a new layer has been added:
        new_layer_id = map.layers[0].id
        new_dataset_id = map.layers[0].dataset.id
        map.delete()

        # ensure that the Layer and the Dataset no longer exist:
        with self.assertRaises(Layer.DoesNotExist):
            Layer.objects.get(id=new_layer_id)
        with self.assertRaises(Dataset.DoesNotExist):
            Dataset.objects.get(id=new_dataset_id)

    def test_delete_map_does_not_remove_datasets_referenced_elsewhere(
            self, **kwargs):
        # create the situation where t2 maps reference the same dataset:
        f1 = self.create_dataset_with_fields()
        map1 = StyledMap.create(datasets=[f1], **self.get_kwargs())
        map2 = StyledMap.create(datasets=[f1], **self.get_kwargs())
        new_dataset_id = map1.layers[0].dataset.id

        # delete one of the maps (but not the other one):
        map1.delete()

        # ensure that the Layer and the Dataset no longer exist:
        self.assertEqual(
            Dataset.objects.get(id=new_dataset_id).name, 'A title')

    def test_delete_map_does_not_remove_dataset_if_not_empty(
            self, **kwargs):
        # create a map with a brand new dataset:
        map = StyledMap.create(**self.get_kwargs())
        new_dataset = map.layers[0].dataset
        new_dataset_id = new_dataset.id
        self.create_record(
            project=new_dataset.project, dataset=new_dataset, point=map.center)

        # delete one of the maps (but not the other one):
        map.delete()

        # ensure that the Layer and the Dataset no longer exist:
        self.assertEqual(
            Dataset.objects.get(id=new_dataset_id).name, 'Untitled Dataset 2')

    def test_create_map_existing_dataset(self, **kwargs):
        f1 = self.create_dataset_with_fields()
        f2 = self.create_dataset_with_fields()
        datasets = [f1, f2]
        num_datasets = len(Dataset.objects.all())
        map = StyledMap.create(datasets=datasets, **self.get_kwargs())
        # Check that a new layer has been added for each dataset specified:
        self.assertEqual(len(map.layers), 2)
        self.assertEqual(map.layers[0].dataset, f1)
        self.assertEqual(map.layers[1].dataset, f2)

        # Check that a new dataset has *not been created:
        self.assertEqual(num_datasets, len(Dataset.objects.all()))
