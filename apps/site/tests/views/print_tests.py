from django import test
from localground.apps.site.views import create_print
from localground.apps.site import models
from localground.apps.site.tests import ViewMixin
from rest_framework import status
	
class PrintViewTest(test.TestCase, ViewMixin):
	def setUp(self):
		ViewMixin.setUp(self)
		self.urls = ['/maps/print/']
		self.view = create_print.generate_print