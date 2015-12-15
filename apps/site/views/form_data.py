from localground.apps.lib.helpers.generic import prep_paginator
from django.http import HttpResponse
from localground.apps.site.decorators import process_identity, process_project
from django.contrib.auth.decorators import login_required
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
import os


@login_required
@process_project
def show_tables(request, project=None):
    context = RequestContext(request)
    context.update({
        "project_id": project.id
    })
    return render_to_response('profile/tables.html', context)