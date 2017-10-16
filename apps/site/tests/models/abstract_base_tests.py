from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class BaseAbstractModelClassTest(test.TestCase, ModelMixin):
    # To run test:
    # $ python manage.py test localground.apps.site.tests.models.PhotoModelTest

    def setUp(self):
        ModelMixin.setUp(self)
        from localground.apps.site import models
        form = self.create_form_with_fields()
        Record = form.TableModel
        self.classes_that_inherit_from_base = {
            'project': models.Project,
            'marker': models.Marker,
            'record': Record,
            'print': models.Print,
            'form': models.Form,
            'field': models.Field,
            'map-image': models.MapImage,
            'image-opts': models.ImageOpts,
            'photo': models.Photo,
            'video': models.Video,
            'audio': models.Audio,
            'relation': models.GenericAssociation,
            'map': models.StyledMap,
            'layer': models.Layer
        }
        self.Photo = models.Photo
        self.photo = self.create_photo()

    def test_classes_all_have_required_class_properties(self, **kwargs):
        count = 0
        for cls in self.classes_that_inherit_from_base.values():
            self.assertTrue(hasattr(cls, 'object_type'))
            self.assertTrue(hasattr(cls, 'model_name'))
            self.assertTrue(hasattr(cls, 'pretty_name'))
            self.assertTrue(hasattr(cls, 'model_name_plural'))
            self.assertTrue(hasattr(cls, 'pretty_name_plural'))
            count += 1
        self.assertEqual(count, 14)

    '''
    ----------------------------------------------------------------------------
    Pick a class that inherits from Base and ensure that all of methods work.
    ----------------------------------------------------------------------------
    '''
    def test_object_type_prop(self, **kwargs):
        # Check that it works for a class and a method
        self.assertEqual(self.Photo.object_type, "photo")
        self.assertEqual(self.photo.object_type, "photo")

    def test_model_name_prop(self, **kwargs):
        # Check that it works for a class and a method
        self.assertEqual(self.Photo.model_name, "photo")
        self.assertEqual(self.photo.model_name, "photo")

    def test_model_name_plural_prop(self, **kwargs):
        # Check that it works for a class and a method
        self.assertEqual(self.Photo.model_name_plural, "photos")
        self.assertEqual(self.photo.model_name_plural, "photos")

    def test_pretty_name_prop(self, **kwargs):
        # Check that it works for a class and a method
        self.assertEqual(self.Photo.pretty_name, "photo")
        self.assertEqual(self.photo.pretty_name, "photo")

    def test_pretty_name_plural_prop(self, **kwargs):
        # Check that it works for a class and a method
        self.assertEqual(self.Photo.pretty_name_plural, "photos")
        self.assertEqual(self.photo.pretty_name_plural, "photos")

    def test_classes_all_have_required_class_methods(self, **kwargs):
        count = 0
        for cls in self.classes_that_inherit_from_base.values():
            import inspect
            self.assertEqual(
                inspect.getargspec(cls.get_model)[0],
                ['cls', 'model_name', 'model_name_plural']
            )
            self.assertTrue(hasattr(cls, 'get_filter_fields'))
            self.assertTrue(hasattr(cls, 'get_content_type'))
            count += 1
        self.assertEqual(count, 14)

    def test_get_model_method_returns_model_unless_args_missing(
        self, **kwargs):
        from localground.apps.site import models
        self.assertEqual(models.Base.get_model(
            model_name="photo"), models.Photo
        )
        self.assertEqual(models.Base.get_model(
            model_name_plural="photos"), models.Photo
        )

        # Ensure no arguments yields an error message:
        with self.assertRaises(Exception) as e:
            models.Base.get_model()
        self.assertEqual(
            e.exception.message,
            "either model_name or model_name_plural argument is required"
        )

    def test_get_filter_fields_returns_correct_tuple(self, **kwargs):
        from localground.apps.site import models
        self.assertEqual(models.Base.get_filter_fields(), {})
        self.assertEqual(len(models.Photo.get_filter_fields()), 11)
        self.assertEqual(
            self.Photo.get_filter_fields().keys(),
            self.photo.get_filter_fields().keys(),
            [
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
            ])

    def test_get_content_type_returns_correct_type(self, **kwargs):
        from localground.apps.site import models
        from django.contrib.contenttypes.models import ContentType
        self.assertEqual(models.Base.get_content_type().name, "base")
        self.assertEqual(
            self.Photo.get_content_type().name,
            self.photo.get_content_type().name,
            "photo"
        )
