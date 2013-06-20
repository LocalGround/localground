#!/usr/bin/env python
import datetime
from django.conf import settings
from django.db import connection
from django.core.paginator import Paginator

class FastPaginator(Paginator):
    """
    overrides default Django paginator class and needed in cases where there are
    hundreds of thousands of Model records.  Why?  Because the default paginator
    queries the entire table in order to get a record count, which leads to
    extremely poor performance.
    """
    def __init__(self, object_list, per_page=10, orphans=0, allow_empty_first_page=True):
        Paginator.__init__(self, object_list, per_page, orphans, allow_empty_first_page)
        
    def _get_count(self):
        "Returns the total number of objects, across all pages."
        if self._count is None:
            try:
                self._count = self.object_list.count()
            except:
                # thrown if object_list is a list instead of a QuerySet (which happens when a RawQuerySet)
                self._count = len(self.object_list)
        return self._count
    count = property(_get_count)

def prep_paginator(request, queryset, per_page=25):
    """
    Adds necessary paging variables to the template context.
    """
    #initialize pagination variables:
    r = request.GET or request.POST
    from django.core.paginator import InvalidPage, EmptyPage   
    paginator = FastPaginator(queryset, per_page=per_page) # Show 25 contacts per page
    try:
        page_num = int(r.get('page', request.COOKIES.get('page', '1')))
    except ValueError:
        page_num = 1
    if per_page*(page_num-1) >= paginator.count:
        page = 1
         
    try:
        objectPage = paginator.page(page_num)
    except (EmptyPage, InvalidPage):
        objectPage = paginator.page(paginator.num_pages)
    d = {
        'objects': objectPage,
        'start_num': (page_num-1)*per_page+1,
        'page': page_num,
        'pages': paginator.num_pages,
        #'previous': objectPage.previous_page_number(), #context['previous'],
        #'has_previous': objectPage.has_previous(), #context['has_next'],context['has_previous'],
        'results_per_page': per_page,
        'page_obj': objectPage,
        'paginator': paginator,
        'is_paginated': paginator.count > per_page
    }
    if objectPage.has_next():
        d.update({
            'has_next': objectPage.has_next(),
            'next': objectPage.next_page_number()
        })
    if objectPage.has_previous():
        d.update({
            'has_next': objectPage.has_previous(),
            'next': objectPage.previous_page_number()
        })
    return d

def generateID(num_digits=8):
    import random
    chars = 'abcdefghijkmnpqrstuvwxyz23456789'
    id = ''   
    while len(id) < num_digits:
       id += chars[random.randrange(0, len(chars)-1)] #chars.find(chars, rand(0, len(chars)-1), 1)
    return id
    


