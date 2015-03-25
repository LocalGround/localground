from django import test
from django.contrib.gis.db import models
from django.db.models.query import QuerySet
from django.db.models import Q

from localground.apps.lib.helpers import QueryParser
from localground.apps.site import models

# model imports
from localground.apps.site.models.marker import Marker
from localground.apps.site.models.photo import Photo



def get_data_sets_from_sql(where_clause, model):
    """
    Get's a data set for the given model,using provided where_clause, using
    raw sql and the QueryParser. Datasets are ordered by id and limited to 10
    entries.

    returns a dataset based on raw execution and a dataset based on parsed execution

    params:
    sql - string of sql query
    model - django model being queried
    """
    sql = "SELECT * FROM {} {} ORDER BY ID LIMIT 10"\
            .format(model._meta.db_table, where_clause)
    raw_dataset = model.objects.raw(sql)


    f = QueryParser(model, sql)
    parsed_dataset = f.extend_query(model.objects.order_by('id'))[:10]

    return raw_dataset, parsed_dataset


class SQLParseTest(test.TestCase):
    """
    Helper class to make testing sql easier
    """
    fixtures = ['initial_data.json', 'test_data.json']

    def compare_sql(self, where_clause, model):
        raw_dataset, parsed_dataset = get_data_sets_from_sql(where_clause, model)
        for r, p in zip(raw_dataset, parsed_dataset):
            self.assertEqual(r.id, p.id)

    def test_no_where_should_be_equal(self, **kwargs):
        self.compare_sql("", Photo)
        self.compare_sql("WHERE id = 1", Photo)

    def test_is_null_operator(self, **kwargs):
        self.compare_sql("WHERE point is not null", Photo)

    def test_equality_operator(self, **kwargs):
        self.compare_sql("WHERE file_name_orig='2013-02-15 17.40.50.jpg'", Photo)
