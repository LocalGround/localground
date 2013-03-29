#!/usr/bin/env python
from django.http import Http404
from django.template import TemplateDoesNotExist
from django.views.generic.simple import direct_to_template

def about_pages(request,page_name):
    try:
        return direct_to_template(request, template="pages/%s.html" % page_name)
    except TemplateDoesNotExist:
        raise Http404()
