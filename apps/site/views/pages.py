#!/usr/bin/env python
from django.http import Http404
from django.template import TemplateDoesNotExist
from django.shortcuts import render as direct_to_template

def about_pages(request,page_name):
    try:
        return direct_to_template(request, template_name="pages/%s.html" % page_name)
    except TemplateDoesNotExist:
        raise Http404()
