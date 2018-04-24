from localground.apps.site import models
from localground.apps.site.models import Layer, StyledMap, Symbol, Dataset
from django.contrib.auth.models import User
from localground.apps.site.tests.models.abstract_base_audit_tests import \
    BaseAuditAbstractModelClassTest
from django import test
from jsonfield import JSONField
from django.contrib.gis.geos import GEOSGeometry
import uuid


class LayerModelTests(BaseAuditAbstractModelClassTest, test.TestCase):
    def setUp(self):
        from localground.apps.site import models
        BaseAuditAbstractModelClassTest.setUp(self)
        self.map = self.create_styled_map()
        self.model = self.map.layers[0]
        self.object_type = self.model_name = self.pretty_name = 'layer'
        self.model_name_plural = self.pretty_name_plural = 'layers'
        self.other_user = User.objects.create_user(
            'tester2',
            first_name='test',
            email='',
            password=self.user_password
        )

    def get_map_kwargs(self):
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
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('styled_map', models.ForeignKey),
            ('title', models.CharField),
            ('display_field', models.ForeignKey),
            ('dataset', models.ForeignKey),
            ('group_by', models.CharField),
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

    def test_creates_new_dataset_if_none_defined(self):
        kwargs = self.get_map_kwargs()
        map = StyledMap.objects.create(**kwargs)
        num_datasets = len(Dataset.objects.all())
        layer = Layer.create(
            last_updated_by=kwargs.get('last_updated_by'),
            owner=kwargs.get('owner'),
            styled_map=map,
            group_by='uniform',
            symbols=[
                Symbol.SIMPLE.to_dict()
            ],
            project=map.project,
            ordering=1
        )
        self.assertEqual(num_datasets + 1, len(Dataset.objects.all()))

    def test_uses_existing_dataset_if_defined(self):
        kwargs = self.get_map_kwargs()
        map = StyledMap.objects.create(**kwargs)
        f1 = self.create_form_with_fields()
        num_datasets = len(Dataset.objects.all())
        layer = Layer.create(
            last_updated_by=kwargs.get('last_updated_by'),
            owner=kwargs.get('owner'),
            styled_map=map,
            dataset=f1,
            group_by='uniform',
            symbols=[
                Symbol.SIMPLE.to_dict()
            ],
            project=map.project,
            ordering=1
        )
        self.assertEqual(num_datasets, len(Dataset.objects.all()))
        self.assertEqual(map.layers[0].dataset, f1)
