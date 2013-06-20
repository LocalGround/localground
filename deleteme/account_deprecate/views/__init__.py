#!/usr/bin/env python
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings

def server_error(request, template_name='500.html'):
    """
    500 error handler.

    Templates: `500.html`
    Context: None
    """
    context = RequestContext(request)
    context.update(dict(DEFAULT_FROM_EMAIL=settings.DEFAULT_FROM_EMAIL))
    return render_to_response(template_name,
        context_instance = context
    )
