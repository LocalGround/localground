#!/usr/bin/env python

###############################################################################
# This script is just for debugging SQL statements.  Not called by the Web App.
###############################################################################
import os, sys
from datetime import datetime
from django.core.management import execute_manager

cwd = os.getcwd()
lib = os.path.dirname(cwd)
site = os.path.dirname(lib) 
apps = os.path.dirname(site)
workspace = os.path.dirname(apps)
sys.path.append(workspace)

from localground.apps.site.lib import sqlparse
from localground.apps.site.lib.sqlparse import tokens as T
from localground.apps.site.lib.sqlparse.sql import Where, Comparison, Identifier, Token
	
def remove_whitespaces(tokens):
	s = []
	for t in tokens:
		if t.ttype != T.Whitespace:
			s.append(t)
	return s

def parse_value(val):
	val = val.strip()
	if val[0] == '\'' and val[-1] == '\'':
		val = val[1:-1]
		DATE_INPUT_FORMATS = ('%m/%d/%Y', '%Y-%m-%d', '%m/%d/%y', '%m-%d-%y', '%m-%d-%Y')
		for format in DATE_INPUT_FORMATS:
			try:
				val = datetime.strptime(val, format)#.strftime('%Y-%m-%d')
				break
			except: pass
	else:
		if val.find('.') != -1:
			try: val = float(val)
			except: pass
		else:
			try: val = int(val)
			except: pass
	return val
	
def parse_where_clause(tokens):
	tokens = remove_whitespaces(tokens)
	tokens.pop(0)
	for i in range(0, len(tokens)):
		t = tokens[i]
		
		#parse equalities and inequalities:
		if isinstance(t, Comparison):
			children = [str(c) for c in remove_whitespaces(t.tokens)]
			children[2] = parse_value(children[2])
			if i > 0:
				children.insert(0, str(tokens[i-1]))
				print 'adding conjunction: %s' % (tokens[i-1])
				where_conditions.append(dict(zip(keys, children)))
			else:
				where_conditions.append(dict(zip(['col_name', 'operator', 'value'], children)))
		elif t.ttype == T.Keyword:
			#parse "in" clauses:
			if str(t) == 'IN':
				lst = str(remove_whitespaces(tokens[i+1].tokens)[1]).split(',')
				lst = [parse_value(l) for l in lst]
				children = [str(tokens[i-1]), str(t), lst]
				if len(where_conditions) > 0:
					print len(where_conditions)
					print 'adding conjunction: %s' % (tokens[i-1])
					children.insert(0, str(tokens[i-1]))
				where_conditions.append(dict(zip(keys, children)))
			#parse "like" clauses:
			elif str(t) == 'LIKE':
				children = [str(tokens[i-1]), str(t), parse_value(str(tokens[i+1]))]
				if len(where_conditions) > 0:
					print len(where_conditions)
					print 'adding conjunction: %s' % (tokens[i-1])
					children.insert(0, str(tokens[i-1]))
				where_conditions.append(dict(zip(keys, children)))

def visualize(where_clause):

	print ' ' + '-'*110
	print ' {0:30} | {1:15} | {2}'.format('VALUE', 'TYPE', 'CLASS')
	print ' ' + '-'*110
	for t in remove_whitespaces(where_clause.tokens):
		a = []
		#try: print t.tokens
		#except: 
		print '|_{0:30} | {1:15} | {2}'.format(t, t.ttype, t.__class__)
		try:
			for e in remove_whitespaces(t.tokens):
				print '|_{0:30} | {1:15} | {2}'.format('_____' + str(e), e.ttype, e.__class__)
		except: pass
		
if __name__ == '__main__':
	keys = ['conjunction', 'col_name', 'operator', 'value']
	where_conditions = []
	like_statements = []
	in_statements = []


	sql = "where c in ('larry','curly', '2/2/2012') and d in (1,2,3) or f = 'g' and g != 123 and n like '%abc%' order by a, b, group by a, b;"
	sql = "SELECT * FROM photo WHERE name like 'ss' or tags in ('a', 'b', 'c') and date_created >= '06/02/2013'"
	sql = "SELECT * FROM photo WHERE description like '%sadasd%' and date_created >= '06/30/2013' and date_created <= '06/02/2013'"
	sql = "SELECT * FROM photo WHERE date_created >= '06/02/2013'"
	sql = sqlparse.format(sql, reindent=False, keyword_case='upper')
	statement = sqlparse.parse(sql)[0]
	where_clause = None
	for i, t in enumerate(remove_whitespaces(statement.tokens)):
		print i, t
		if isinstance(t, Where):
			where_clause =  t
		#break
		
	visualize(where_clause)
	parse_where_clause(where_clause.tokens)
	for c in where_conditions: print c
	print '\n', sql, '\n'	
