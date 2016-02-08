#!/usr/bin/env python
from django.http import Http404
from django.template import TemplateDoesNotExist
from django.shortcuts import render as direct_to_template
from django.http import HttpResponse


def scot(request):
  from localground.apps.tasks import add
  result = add.delay(4, 4)
  resultString = "Response: " + str(result.ready()) + ". result = " + str(result.get(timeout=1))
  return HttpResponse(resultString)