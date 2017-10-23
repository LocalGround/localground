from localground.apps.site.models import Form

from django.contrib.gis.db import models

from localground.apps.site.tests.models.abstract_base_tests import \
    BaseAbstractModelClassTest
from django import test


# form test in progress
class FormTest(BaseAbstractModelClassTest, test.TestCase):

    def setUp(self):
        BaseAbstractModelClassTest.setUp(self)

    # Still need more to test...
