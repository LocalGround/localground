from localground.apps.site.models import Print, Layout, Form, Field, DataType
from localground.apps.site.decorators import process_identity, process_project
from django.http import HttpResponse
from localground.apps.helpers import generic
import simplejson as json

@process_identity
def get_datatypes(request, identity=None):
    types = DataType.objects.all().order_by('name')
    return HttpResponse(json.dumps(dict(
        types=[t.to_dict() for t in types]    
    )))
    

@process_identity
def create_form(request, identity=None, is_json=False):
    from django.db import connection, transaction
    r = request.POST or request.GET
    form = Form.create_new_form(r)
    
    return HttpResponse(json.dumps(dict(
        form=form.to_dict()
    )))        
    