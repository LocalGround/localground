from localground.apps.site import models
from localground.apps.site.models import Video
from localground.apps.site.tests.models import \
    ProjectMixinTest, NamedMixinTest, PointMixinTest, \
    BaseAuditAbstractModelClassTest
from localground.apps.lib.helpers import upload_helpers
from django import test
import os

class AudioModelTest(ProjectMixinTest, NamedMixinTest, 
    PointMixinTest, BaseAuditAbstractModelClassTest,test.TestCase):
#class VideoModelTest(BaseUploadedMediaAbstractModelClassTest, test.TestCase):

    '''
    def setUp(self):
        BaseUploadedMediaAbstractModelClassTest.setUp(self)
        self.model = Video()

    def tearDown(self):
        # delete method also removes files from file system:
        for video in models.Audio.objects.all():
            video.delete()

    def test_model_properties(self, **kwargs):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('video_id', models.CharField),
            ('provider', models.CharField),
            ('attribution', models.CharField)
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Video._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)
        
        test_filter_fields = (
            'id', 'project', 'date_created', 'name', 'description', 'tags', 'point'
        )
        self.assertTrue(hasattr(self.model, 'filter_fields'))
        self.assertEqual(self.model.filter_fields, test_filter_fields)
        '''
    def setUp(self):
        ProjectMixinTest.setUp(self)
        #NamedMixinTest.setUp(self)
        PointMixinTest.setUp(self)
        BaseAuditAbstractModelClassTest.setUp(self)
        
        self.model = self.create_video()
    
    def test_static_properties(self, **kwargs):
        test_providers = (
            ('vimeo', 'Vimeo'),
            ('youtube', 'YouTube')
        )
        self.assertEqual(self.model.VIDEO_PROVIDERS, test_providers)
    
    def test_model_properties(self):
        from django.contrib.gis.db import models
        from localground.apps.site.models import BaseUploadedMedia
        for prop in [
            ('video_id', models.CharField),
            ('provider', models.CharField),
            ('attribution', models.CharField),
        ]:
            prop_name = prop[0]
            prop_type = prop[1]
            field = Video._meta.get_field(prop_name)
            self.assertEqual(field.name, prop_name)
            self.assertEqual(type(field), prop_type)

    def test_other_attributes(self):
        test_ff = (
            'id', 'project', 'date_created', 'name', 'description', 'tags', 'point'
        )
        self.assertEqual(self.model.filter_fields, test_ff)

    def test_info_methods(self):
        self.model.id = 777
        self.model.name = 'test_video'
        self.model.video_id = 333
        self.model.provider = 'youtube'

        test__str__ = '777: test_video (333: youtube)'
        test__repr__ = '777: test_video (333: youtube)'

        self.assertEqual(self.model.__str__(), test__str__)
        self.assertEqual(self.model.__repr__(), test__repr__)
        