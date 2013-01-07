from localground.apps.site.decorators import process_identity
from django.http import HttpResponse
import simplejson as json

@process_identity
def get_datatypes(request, identity=None):
    from localground.apps.site.models import DataType
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
    