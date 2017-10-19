from localground.apps.site.tests import ModelMixin
from localground.apps.site import models
from django import test
from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest

'''
This test runs all of the BaseAbstractModelClassTests as well as the tests
for this class.
'''


class BaseAuditAbstractModelClassTest(BaseAbstractModelClassTest):
    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        """
        form = self.create_form_with_fields()
        Record = form.TableModel
        photo = self.create_photo()
        marker = self.create_marker()
        map_image = self.create_mapimage()
        relation = self.create_relation(marker, photo)

        self.object_instances_that_inherit_from_base_audit = {
            # Groupings and Associations
            'project': self.create_project(),
            'relation': relation,

            # Presentation-Related
            # To Do: create create_styled_map() method
            #    'map': models.StyledMap,
            # To Do: create create_layer() method
            #'layer': models.Layer,

            # Tiles
            # To Do: create create_tile() method
            # 'tileset': models.TileSet,

            # User-Defined Schemas
            'form': form,
            'field': form.fields[0],

            # Sites
            'marker': marker,
            'record': self.insert_form_data_record(form),

            # Prints
            'print': self.create_print(),

            # Map Image Processing:
            'map_image': map_image,
            'image_opts': self.create_imageopt(map_image),

            # Media:
            'photo': photo,
            'video': self.create_video(),
            'audio': self.create_audio()
        }
        self.Photo = models.Photo
        self.photo = self.create_photo()
        """
    """
    def test_classes_all_have_required_properties(self, **kwargs):
        count = 0
        instance_list = self.object_instances_that_inherit_from_base_audit.values()
        for instance in instance_list:
            self.assertTrue(hasattr(instance, 'owner'))
            self.assertTrue(hasattr(instance, 'last_updated_by'))
            self.assertTrue(hasattr(instance, 'date_created'))
            self.assertTrue(hasattr(instance, 'time_stamp'))
            self.assertTrue(hasattr(instance, 'filter_fields'))
            count += 1
        self.assertEqual(count, len(instance_list))
    """

    def test_filter_fields_set_correctly_for_baseaudit_abstract_class(
            self, **kwargs):
        test_fields = ('id', 'date_created', 'time_stamp')
        self.assertEqual(models.BaseAudit.filter_fields, test_fields)

    def test_get_filter_fields_returns_correct_query_fields_dict(
            self, **kwargs):
        test_keys = ['owner', 'date_created', 'time_stamp']
        self.assertEqual(models.BaseAudit.get_filter_fields().keys(),test_keys)
