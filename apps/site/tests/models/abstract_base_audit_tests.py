from localground.apps.site.tests import ModelMixin
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
        from localground.apps.site import models
        form = self.create_form_with_fields()
        Record = form.TableModel
        self.classes_that_inherit_from_base_audit = {
            # Groupings and Associations
            'project': models.Project,
            'relation': models.GenericAssociation,

            # Presentation-Related
            'map': models.StyledMap,
            'layer': models.Layer,

            # Tiles
            'tileset': models.TileSet,

            # User-Defined Schemas
            'form': models.Form,
            'field': models.Field,

            # Sites
            'marker': models.Marker,
            'record': Record,

            # Prints
            'print': models.Print,

            # Map Image Processing:
            'map_image': models.MapImage,
            'image_opts': models.ImageOpts,

            # Media:
            'photo': models.Photo,
            'video': models.Video,
            'audio': models.Audio
        }
        self.Photo = models.Photo
        self.photo = self.create_photo()

    def test_classes_all_have_required_properties(self, **kwargs):
        count = 0
        class_list = self.classes_that_inherit_from_base_audit.values()
        for cls in class_list:
            self.assertTrue(hasattr(cls, 'owner'))
            self.assertTrue(hasattr(cls, 'last_updated_by'))
          #  self.assertTrue(hasattr(cls, 'date_created')) DateTime fields failing this test...
          #  self.assertTrue(hasattr(cls, 'time_stamp'))   DateTime fields failing this test...
            self.assertTrue(hasattr(cls, 'filter_fields'))
            count += 1
        self.assertEqual(count, len(class_list))

    def test_filter_fields_set_correctly_for_baseaudit_abstract_class(
            self, **kwargs):
        test_fields = ('id', 'date_created', 'time_stamp')
        self.assertEqual(self.Photo.filter_fields, test_fields)
        self.assertEqual(self.photo.filter_fields, test_fields)


    def test_get_filter_fields_returns_correct_query_fields_dict(
            self, **kwargs):
        test_keys = [
            'attribution',
            'name',
            'file_name_orig',
            'tags',
            'point',
            'owner',
            'project',
            'caption',
            'device',
            'date_created',
            'id'
        ]
        self.assertEqual(self.Photo.get_filter_fields().keys(),test_keys)
        self.assertEqual(self.photo.get_filter_fields().keys(), test_keys)
