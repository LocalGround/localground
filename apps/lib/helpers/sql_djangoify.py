#!/usr/bin/env python

import re

from django.db.models import Q
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D

where_finder = re.compile(r"(?:where)(.+?)(?:(order by \w+|limit \d+)\s*){0,2}$", re.I)

def get_where_clause(sql):
    """
    Pulls out statements in where clause from given sql.
    """
    m = where_finder.search(sql)
    if m:
        return m.group(1).strip()
    else:
        return None

def split_statements(where):
    """
    Splits where statement into conditions and conjunctions
    """
    split = re.split("(\s(?:and|or)\s)", where)
    out = []
    temp = ""

    while split:
        temp += split.pop(0)
        if temp.count("'")%2==0:
            out.append(temp.strip())
            temp = ""

    return out

def get_where_conditions(sql):
    """
    Pulls where conditions from sql.
    """
    where = get_where_clause(sql)
    
    if where:
        return split_statements(where)
    else:
        return None


sql_lookup = {
            '=': 'exact',
            '>': 'gt',
            '>=': 'gte',
            '<': 'lt',
            '<=': 'lte',
            'LIKE': 'icontains',
            'IN': 'in'
}



class UnrecognizedPatternError(Exception):
    pass

class UnrecognizedConjunctionError(Exception):
    pass


class ClauseInterpreter:
    """
    Interprets where clauses into django Q objects
    """
    def __init__(self):
        self._handlers = [] # holds interpreters for sql functions

    def parse_sql(self, sql):
        conditions = get_where_conditions(sql)
        if conditions is None:
            return None

        query = None
        conjunction = None

        while conditions:
            q = self.djangoify_clause(conditions.pop(0))

            if query and conjunction:
                if conjunction.lower() == 'and':
                    query = query & q
                elif conjunction.lower() == 'or':
                    query = query | q
                else:
                    raise UnrecognizedConjunctionError
            else:
                query = q

            if conditions:
                conjunction = conditions.pop(0)

        return query

    def djangoify_clause(self, clause, flags=None):
        for h in self._handlers:
            m = h["matcher"].match(clause)
            if m:
                args = m.groupdict()
                return h["func"](**args)

        # if nothing matches, raise error
        raise UnrecognizedPatternError
            

    def pattern_handler(self, pattern, flags=None):
        """
        Decorator to add a function to the parser.

        params:
        pattern - regex pattern to check for a match and create keywords. 
                    The groupdict from a match will be passed to the decorated function
        flags - standard regex flags to be used in compiling pattern
        """
        def wrapper(func):
            self._handlers.append({
                "func": func,
                "matcher": re.compile(pattern, flags)
                })
            return func
        return wrapper


parser = ClauseInterpreter()

@parser.pattern_handler(r"""
        (?P<col>[a-z0-9._]+)\s*
        (?P<op>[<>=]{1,2})\s*
        (?:(?P<num>\d+(\.\d+)?)|'(?P<text>.*)'$)
        """, re.I | re.X)
def comparison_pattern(col, op, num=None, text=None):
    key = "{}__{}".format(col, sql_lookup[op])
    if num is None:
        val = text
    else:
        val = num
    args = {key: val}
    return Q(**args)
    
@parser.pattern_handler(r"""
        (?P<col>[a-z0-9._]+)\s*
        like\s*
        '%(?P<val>.*)%'$
        """, re.I | re.X)
def contains(col, val):
    key = "{}__icontains".format(col, sql_lookup["LIKE"])
    val = val
    args = {key: val}
    print args
    return Q(**args)

@parser.pattern_handler(r"""
        (?P<col>[a-z0-9._]+)\s*
        like\s*
        '(?P<val>.*)%'$
        """, re.I | re.X)
def startswith(col, val):
    key = "{}__startswith".format(col, sql_lookup["LIKE"])
    val = val
    args = {key: val}
    print args
    return Q(**args)

@parser.pattern_handler(r"""
        (?P<col>[a-z0-9._]+)\s*
        like\s*
        '%(?P<val>.*)'$
        """, re.I | re.X)
def endswith(col, val):
    key = "{}__iendswith".format(col, sql_lookup["LIKE"])
    val = val
    args = {key: val}
    print args
    return Q(**args)

@parser.pattern_handler(r"""
        (?P<col>[a-z0-9._]+)\s*
        in\s*
        \((?P<vals>.*)\)$
        """, re.I | re.X)
def in_pattern(col, vals):
    key = "{}__in".format(col)
    vals = vals.strip("'") # remove start and end quotes
    val = re.split(r",'?\s*'?", vals)
    args = {key: val}
    return Q(**args)

@parser.pattern_handler(r"""
    st_distance\((?P<col>[a-z0-9._]+),\s*
    point\(
        (?P<lat>-?\d+\.\d*),\s*
        (?P<lon>-?\d+\.\d*)
    \)\)\s*
    (?P<op>[<>=]{1,2})\s*
    (?P<dist>\d)
    """, re.I | re.X)
def distance_pattern(col, lat, lon, op, dist):
    point = Point(float(lat), float(lon))
    val = (point, D(m=dist))
    key = "{}__distance_{}".format(col, sql_lookup[op])
    args = {
        key: val
        }

    return Q(**args)
