from django import test
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models.query import QuerySet
from django.db.models import Q

from localground.apps.lib.helpers import QueryParser
from localground.apps.lib.helpers.sql_djangoify import get_where_clause, split_statements, get_where_conditions
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


class SQLStatementTest(test.TestCase):
    """
    Tests for code that pulls statements out of sql.
    """
    def test_where_clause_should_extract(self):
        where = "col1 = val 1"
        sql = "select * from stuff where " + where
        self.assertEqual(where, get_where_clause(sql))

        sql = "select * from stuff where " + where + " order by stuff"
        self.assertEqual(where, get_where_clause(sql))

    def test_statement_extraction(self):
        statements = [
                "col1 = val1",
                "and",
                "col2 = val2",
                "and",
                "col3 = 'a and b'"
                ]
        test = split_statements(" ".join(statements))
        for a, b in zip (statements, test):
            self.assertEqual(a, b)

    def test_where_conditions(self):
        statements = [
                "col1 = val1",
                "and",
                "col2 = val2",
                "and",
                "col3 = 'a and b'"
                ]
        sql = "select * from stuff where {}".format(" ".join(statements))
        test = get_where_conditions(sql)

        for a, b in zip (statements, test):
            self.assertEqual(a, b)


class SQLParseTest(test.TestCase):
    fixtures = ['initial_data.json', 'test_data.json']

    def compare_sql(self, where_clause, model):
        raw_dataset, parsed_dataset = get_data_sets_from_sql(where_clause, model)
        n = 0
        for r, p in zip(raw_dataset, parsed_dataset):
            n+=1
            self.assertEqual(r.id, p.id)

        if n== 0:
            self.fail("no results to compare")

    def test_no_where_should_be_equal(self, **kwargs):
        self.compare_sql("", Photo)

    def test_equality_operator(self, **kwargs):
        self.compare_sql("WHERE file_name_orig='2013-02-15 17.40.50.jpg'", Photo)

    def test_geo_query(self, **kwargs):
        self.compare_sql("WHERE ST_DISTANCE(point, POINT(-122.2459916666666686, 37.8964594444444458)) < 1", Photo)

    def test_simple_geo_query(self):
        point = Point(-122.2459916666666686, 37.8964594444444458)
        Photo.objects.filter(point__distance_lt=(point, D(m=5)))
