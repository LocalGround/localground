from localground.apps.site.api.tests.base_tests import ModelMixin
from django import test
from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.db.models.query import QuerySet
from django.db.models import Q
import pdb
from localground.apps.lib.helpers.sqlparse.sqlparser import QueryParser
from localground.apps.lib.helpers.sqlparse.sql_djangoify import get_where_clause, split_statements, get_where_conditions
from localground.apps.site import models

# model imports
from localground.apps.site.models.marker import Marker
from localground.apps.site.models.photo import Photo

def get_data_sets_from_sql(model, raw_where_clause, parsed_where_clause=None):
    """
    Gets a data set for the given model,using provided where_clause, using
    raw sql and the QueryParser. Datasets are ordered by id and limited to 10
    entries.

    returns a dataset based on raw execution and a dataset based on parsed execution

    params:
    model - django model being queried
    raw_where_clause - string of sql query to be used for raw data set
    parsed_where_clause - string of sql query to be used for parsed data set
    """
    if not parsed_where_clause:
        parsed_where_clause = raw_where_clause

    raw_sql = "SELECT * FROM {} {} ORDER BY ID LIMIT 10"\
            .format(model._meta.db_table, raw_where_clause)

    parsed_sql = "SELECT * FROM {} {}"\
            .format(model._meta.db_table, parsed_where_clause)
    raw_dataset = model.objects.raw(raw_sql.replace("%", "%%")) # % signs need to be escaped or the connection expects parameters

    f = QueryParser(model, parsed_sql)
    # to debug test_equality_operator error:
    #print parsed_sql, f.where_conditions
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

        sql = "select * from stuff where " + where + " order by stuff limit 10"
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


class SQLParseTest(test.TestCase, ModelMixin):
    fixtures = ['initial_data.json', 'test_data.json']
    
    def setUp(self):
        '''
        Create some dummy data using the ModelMixin, to make sure that the queries
        are actually matching, given the data.
        '''
        ModelMixin.setUp(self)
        self.photo1 = self.create_photo(self.user, self.project, file_name='2013-07-04 16.56.55.jpg', point=Point(-122.246, 37.896))
        self.photo2 = self.create_photo(self.user, self.project, file_name='2013-06-30 18.25.38.jpg', point=Point(-122.846, 37.396),
                                        device='SCH-I535', tags=['a','b','c'])

    def compare_sql(self, model, raw_where, parsed_where=None):
        raw_dataset, parsed_dataset = get_data_sets_from_sql(model, raw_where, parsed_where)
        n = 0
        for r, p in zip(raw_dataset, parsed_dataset):
            n+=1
            self.assertEqual(r.id, p.id)

        if n== 0:
            raw_count = len(list(raw_dataset))
            parsed_count = len(list(parsed_dataset))

            # output incorrectly parsed SQL and raise failure error:
            if not parsed_where:
                parsed_where = raw_where
            parsed_sql = "SELECT * FROM {} {}".format(model._meta.db_table, parsed_where)
            f = QueryParser(model, parsed_where)
            self.fail(
                "No results to compare - raw:{} parsed:{};\n\
                Where clause '{}' parsed to: '{}'".format(
                    raw_count, parsed_count, parsed_where, f.where_conditions
                )
            )

    def test_no_where_should_be_equal(self, **kwargs):
        self.compare_sql(Photo, "")

    def test_equality_operator(self, **kwargs):
        # test string compare, with and without single quotes:
        self.compare_sql(Photo, "WHERE file_name_orig='%s'" % self.photo1.file_name_orig,)
        self.compare_sql(
            Photo,
            "WHERE file_name_orig='%s'" % self.photo1.file_name_orig,
            "WHERE file_name_orig=%s" % self.photo1.file_name_orig
        )
    
    def test_number_compare(self, **kwargs):
        # test number compare
        self.compare_sql(Photo, "WHERE id<%s" % self.photo2.id,)
        self.compare_sql(Photo, "WHERE id=%s" % self.photo1.id,)
        self.compare_sql(Photo, "WHERE id>%s" % 0,)
        self.compare_sql(Photo, "WHERE id>%s" % 5,)

    def test_and_conjunction(self):
        self.compare_sql(Photo, "WHERE device='SCH-I535' and id < %s" % self.photo1.id,)
        self.compare_sql(
            Photo,
            "WHERE device='SCH-I535' AND id < %s" % self.photo1.id,
            "WHERE device=SCH-I535 and id < %s" % self.photo1.id
        )

    def test_or_conjunction(self):
        self.compare_sql(Photo, "WHERE device='SCH-I535' or id < %s" % self.photo1.id)
        self.compare_sql(Photo, "WHERE device='SCH-I535' or id < %s" % self.photo1.id, "WHERE device=SCH-I535 or id < %s" % self.photo1.id)

    def test_like_operator(self):
        self.compare_sql(Photo, "WHERE device LIKE '%I5%'")
        self.compare_sql(Photo, "WHERE device LIKE '%I5%'", "WHERE device LIKE %I5%")

    def test_startswith_operator(self):
        self.compare_sql(Photo, "WHERE device like 'HTC%'")
        self.compare_sql(Photo, "WHERE device like 'HTC%'", "WHERE device LIKE HTC%")

    def test_endswith_operator(self):
        self.compare_sql(Photo, "WHERE device like '%535'")
        self.compare_sql(Photo, "WHERE device like '%535'", "WHERE device like %535")

    def test_in_operator(self):
        f1, f2 = self.photo1.file_name_orig, self.photo2.file_name_orig
        self.compare_sql(Photo, "WHERE file_name_orig in ('{}', '{}')".format(f1, f2))
        self.compare_sql(
            Photo,
            "WHERE file_name_orig in ('{}', '{}')".format(f1, f2),
            "WHERE file_name_orig in ({}, {})".format(f1, f2)
        )

    def test_contains_operator(self):
        self.compare_sql(Photo, "WHERE tags @> ARRAY['a']", "WHERE tags CONTAINS ('a')")
        self.compare_sql(Photo, "WHERE tags @> ARRAY['b']", "where tags contains (b)")
        self.compare_sql(Photo, "WHERE tags @> ARRAY['a', 'b']", "WHERE tags CONTAINS (a, b)")
        self.compare_sql(Photo, "WHERE tags @> ARRAY['a', 'b']", "WHERE tags contains ('a', 'b')")
        
    def test_geo_query_new(self, **kwargs):
        sql = "WHERE point within buffer(-122.246, 37.896, 1000)" #return all photos within 1,000 meters
        f = QueryParser(Photo, sql)
        parsed_dataset = f.extend_query(Photo.objects.order_by('id'))
        #expect two photos to return 
        self.assertEqual(len(parsed_dataset), 2)
        
        sql = "WHERE point WITHIN buffer(-122.246, 37.896, 10)" #return all photos within 10 meters
        f = QueryParser(Photo, sql)
        parsed_dataset = f.extend_query(Photo.objects.order_by('id'))
        #expect 1 photo to return 
        self.assertEqual(len(parsed_dataset), 1)
        

    def test_simple_geo_query(self):
        point = Point(-122.246, 37.896)
        Photo.objects.filter(point__distance_lt=(point, D(m=5)))
