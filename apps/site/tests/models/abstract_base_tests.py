from localground.apps.site.tests import ModelMixin
from django import test
from localground.apps.site import models


class BaseAbstractModelClassTest(ModelMixin):
    # To run test:
    # $ python manage.py test localground.apps.site.tests.models.PhotoModelTest

    def setUp(self):
        ModelMixin.setUp(self)
        '''
        form = self.create_form_with_fields()
        Record = form.TableModel
        self.classes_that_inherit_from_base = {
            # Groupings and Associations
            DONE 'project': models.Project,
            DONE 'relation': models.GenericAssociation,

            # Permissions
            DONE 'object_authority': models.ObjectAuthority,
            DONE 'user_authority': models.UserAuthority,
            DONE 'user_object_authority': models.UserAuthorityObject,

            # Presentation-Related
            DONE 'map': models.StyledMap,
            DONE 'layer': models.Layer,

            # Tiles
            DONE 'tileset': models.TileSet,
            DONE 'overlay_source': models.OverlaySource,
            DONE 'overlay_type': models.OverlayType,

            # User-Defined Schemas
            DONE 'form': models.Form,
            DONE 'field': models.Field,
            DONE 'data_type': models.DataType,

            # Sites
            DONE 'marker': models.Marker,
            'record': Record,

            # Prints
            DONE 'print': models.Print,
            DONE 'layout': models.Layout,

            # Map Image Processing:
            DONE 'map_image': models.MapImage,
            DONE 'image_opts': models.ImageOpts,
            DONE 'error_code': models.ErrorCode,
            DONE 'status_code': models.StatusCode,

            # Media:
            DONE 'photo': models.Photo, 
            DONE 'video': models.Video,
            DONE 'audio': models.Audio
        }
        self.Photo = models.Photo
        self.photo = self.create_photo()
        '''
        

    def test_classes_all_have_required_class_properties(self, **kwargs):
        c = self.model.__class__
        self.assertTrue(hasattr(c, 'object_type'))
        self.assertTrue(hasattr(c, 'model_name'))
        self.assertTrue(hasattr(c, 'pretty_name'))
        self.assertTrue(hasattr(c, 'model_name_plural'))
        self.assertTrue(hasattr(c, 'pretty_name_plural'))

    '''
    ----------------------------------------------------------------------------
    CLASS PROPERTIES
    Pick a class that inherits from Base and ensure that all of methods work.
    ----------------------------------------------------------------------------
    '''
    def test_object_type_prop(self):
        # Check that it works for a class and a method
        self.assertEqual(self.model.__class__.object_type, self.object_type)
        self.assertEqual(self.model.object_type, self.object_type)

    def test_model_name_prop(self):
        # Check that it works for a class and a method 
        self.assertEqual(self.model.__class__.model_name, self.model_name)
        self.assertEqual(self.model.model_name, self.model_name)

    def test_model_name_plural_prop(self):
        # Check that it works for a class and a method
        self.assertEqual(self.model.__class__.model_name_plural, self.model_name_plural)
        self.assertEqual(self.model.model_name_plural, self.model_name_plural)

    def test_pretty_name_prop(self):
        # Check that it works for a class and a method
        self.assertEqual(self.model.__class__.pretty_name, self.pretty_name)
        self.assertEqual(self.model.pretty_name, self.pretty_name)

    def test_pretty_name_plural_prop(self):
        # Check that it works for a class and a method
        self.assertEqual(self.model.__class__.pretty_name_plural, self.pretty_name_plural)
        self.assertEqual(self.model.pretty_name_plural, self.pretty_name_plural)

    '''
    ----------------------------------------------------------------------------
    CLASS PROPERTIES
    Pick a class that inherits from Base and ensure that all of methods work.
    ----------------------------------------------------------------------------
    '''
    def test_has_required_class_methods(self, **kwargs):
        c = self.model.__class__
        import inspect
        self.assertEqual(
            inspect.getargspec(c.get_model)[0],
            ['cls', 'model_name', 'model_name_plural']
        )
        self.assertTrue(hasattr(c, 'get_filter_fields'))
        self.assertTrue(hasattr(c, 'get_content_type'))

    def test_get_model_method_returns_model_unless_args_missing(
            self, **kwargs):
        from localground.apps.site import models
        self.assertEqual(models.Base.get_model(
            model_name=self.model_name), self.model.__class__
        )
        self.assertEqual(models.Base.get_model(
            model_name_plural=self.model_name_plural), self.model.__class__
        )
        #print(self.model_name_plural)

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
            self.model.__class__.get_filter_fields().keys(),
            self.model.get_filter_fields().keys(),
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
            self.model.__class__.get_content_type().name,
            self.model.get_content_type().name,
            self.model_name
        )
