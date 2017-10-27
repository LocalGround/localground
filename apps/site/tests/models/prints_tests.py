from localground.apps.site.models import Print

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test

class PrintsTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)
        self.model = Print()

    def test_dummy(self, **kwargs):
        pass

    def test_get_abs_directory_path(self, **kwargs):
        self.assertEqual(self.model.get_abs_directory_path(), '/localground')
        pass

    def test_get_abs_virtual_path(self, **kwargs):
        self.assertEqual(self.model.get_abs_virtual_path(),'//')
        pass

    def test_generate_relative_path(self, **kwargs):
        self.assertEqual(self.model.generate_relative_path(),'/userdata/prints//')
        pass

    def test_configuration_url(self, **kwargs):
        # when attempting to print out the configuration
        # there is no stored data from urllib.urlencode
        # hence causing an error
        print(self.model.configuration_url())
        #self.assertEqual(self.model.configuration_url(),'/userdata/prints//')
        pass

    '''
    Unfortunately, the encryption process for thumb, map, and pdf
    always results in randomized links
    '''

    def test_thumb(self, **kwargs):
        print(self.model.thumb())
        self.assertEqual(self.model.thumb(),'http:///profile/prints/IzE1MDkxMzkzMDQ=/')
        pass

    def test_map(self, **kwargs):
        print(self.model.map())
        self.assertEqual(self.model.map(),'http:///profile/prints/IzE1MDkxMzkzMDU=/')
        pass

    def test_pdf(self, **kwargs):
        print(self.model.pdf())
        self.assertEqual(self.model.pdf(),'http:///profile/prints/IzE1MDkxMzkzMDM=/')
        pass
