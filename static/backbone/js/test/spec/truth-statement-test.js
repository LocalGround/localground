define(["jquery", "lib/truthStatement", "../../test/spec-helper"], function ($, TruthStatement) {
    'use strict';
    var valid_statements = [
            'a = 3',
            'a < 3',
            'a > 3',
            'a <> 3',
            'a <= 3',
            'a >= 3',
            'a=3',
            'a<3',
            'a>3',
            'a<>3',
            'a<=3',
            'a>=3',
            'a in (1,2,3)',
            'a like %a%',
            'a contains \'bcd\'',
            'a startswith ab',
            'a endswith ed',
            'a=\'hello <world\'',
            'a =\'hello <world\'',
            'a =='
        ],
        invalid_statements = [
            'acontains b',
            'a likeb',
            'ainb',
            'random sentence'
        ];
    describe("TruthStatement: Check conjunctions", function () {
        it("Check that conjunction is 'AND' or 'OR' keyword (case-insensitive)", function () {
            var s = new TruthStatement();
            //should throw an exception:
            expect(function () { s.setConjunction('blah'); }).toThrow();

            //should not throw an exception:
            expect(function () { s.setConjunction('and'); }).not.toThrow();
            expect(function () { s.setConjunction('or'); }).not.toThrow();
        });
    });

    describe("TruthStatement: Check token splitting", function () {
        var s = new TruthStatement();
        $.each(valid_statements, function () {
            var whereClause = this;
            it("Produces 3 tokens for \"" + whereClause + "\"", function () {
                expect(function () {
                    s.setTokens(whereClause);
                }).not.toThrow();
            });
        });

        $.each(invalid_statements, function () {
            var whereClause = this;
            it("Does not produce 3 tokens for \"" + whereClause + "\"", function () {
                expect(function () {
                    s.setTokens(whereClause);
                }).toThrow();
            });
        });
    });

    describe("TruthStatement: Check operator validation", function () {
        var s = new TruthStatement();
        $.each(valid_statements, function () {
            var whereClause = this;
            it("Operator is valid for: \"" + whereClause + "\"", function () {
                expect(function () {
                    s.setTokens(whereClause);
                    s.setOperator(s.tokens[1]);
                }).not.toThrow();
            });
        });

        $.each(invalid_statements, function () {
            var whereClause = this;
            it("Operator is invalid for: \"" + whereClause + "\"", function () {
                expect(function () {
                    s.setTokens(whereClause);
                    s.setOperator(s.tokens[1]);
                }).toThrow();
            });
        });
    });

    describe("TruthStatement: Checking overall parser (combination of the above tests)", function () {
        var s;// = new TruthStatement();
        $.each(valid_statements, function () {
            var whereClause = this;
            it("Sucessfully parsed: \"" + whereClause + "\"", function () {
                expect(function () {
                    s = new TruthStatement(whereClause, "and");
                }).not.toThrow();
            });
        });

        $.each(invalid_statements, function () {
            var whereClause = this;
            it("Failed to parse: \"" + whereClause + "\"", function () {
                expect(function () {
                    s = new TruthStatement(whereClause, "and");
                }).toThrow();
            });
        });
    });

    describe("TruthStatement: Utility function tests", function () {
        var s = new TruthStatement();
        it("Successfully trims single quotes", function () {
            expect(s.trimSingleQuotes("'hello'")).toEqual("hello");
            expect(s.trimSingleQuotes("'hello'")).not.toEqual("'hello'");
            expect(s.trimSingleQuotes("'hello'")).not.toEqual("hello'");
            expect(s.trimSingleQuotes("'hello'")).not.toEqual("'hello");
        });
        it("Successfully trims percentages", function () {
            expect(s.trimPercentages("%hello%")).toEqual("hello");
            expect(s.trimPercentages("%hello%")).not.toEqual("%hello%");
            expect(s.trimPercentages("%hello%")).not.toEqual("hello%");
            expect(s.trimPercentages("%hello%")).not.toEqual("%hello");
        });
        it("Successfully trims parentheses", function () {
            expect(s.trimParentheses("(hello)")).toEqual("hello");
            expect(s.trimParentheses("(hello)")).not.toEqual("(hello)");
            expect(s.trimParentheses("(hello)")).not.toEqual("hello)");
            expect(s.trimParentheses("(hello)")).not.toEqual("(hello");
        });
        it("Successfully parses integers from string", function () {
            expect(s.parseNum("5")).toEqual(5);
            expect(s.parseNum("5")).not.toEqual("5");
        });
        it("Successfully parses strings from integers", function () {
            expect(s.parseString(5)).toEqual("5");
            expect(s.parseString(5)).not.toEqual(5);
        });
    });

    describe("TruthStatement: Model comparison tests", function () {
        var s1 = new TruthStatement("id = 1", "and"),
            s2 = new TruthStatement("name = 'dog'", "and"),
            match_dictionary = {
                "tags contains animal": 3,
                "tags contains 'animal'": 3,
                "tags startswith animal": 3,
                "tags startswith 'animal'": 3,
                "tags endswith 'dog'": 1,
                "name = dog": 1,
                "name = 'dog'": 1,
                "name = 'Dog'": 1,
                "name in ('Dog', 'Cat')": 2,
                "name in (dog, cat)": 2,
                "name in (dog1, cat)": 1,
                "name in dog, cat, Frog": 3, //note: parenthesis, single quotes, case sensitivity optional
                "name like '%o%": 2,
                "name like '%o%'": 2,
                "name like 'd%": 1,
                "name like '%g'": 2,
                "id in (1,2,3)": 3,
                "id in ('1', '2', '3')": 3, //even if user is confused about the datatype.
                "id <> 1": 2,
                "id != 2": 2,
                "id < 4": 3,
                "id <= 3": 3,
                "id >= 4": 0,
                "id > 2": 1,
                "id = 2": 1
            },
            s = new TruthStatement(),
            key = null,
            matches = 0;

        it("Successfully converts model value to comparison value", function () {
            var key1 = s1.key,
                key2 = s2.key,
                photo = this.photos.get(1),
                modelVal1 = photo.get(key1),
                modelVal2 = photo.get(key2),
                convertedVal1 = s1.convertType(modelVal1),
                convertedVal2 = s2.convertType(modelVal2);
            expect(typeof modelVal1).toEqual(typeof convertedVal1);
            expect(typeof modelVal2).toEqual(typeof convertedVal2);
        });

        it("Photos do not match queries which are untrue", function () {
            var that = this;
            //valid_statements are valid, but not true:
            $.each(valid_statements, function () {
                var whereClause = this,
                    s = new TruthStatement(whereClause, "and"),
                    matches = 0;
                that.photos.each(function (model) {
                    if (s.truthTest(model)) {
                        ++matches;
                    }
                });
                expect(matches).toEqual(0);
            });
        });
    
        for (key in match_dictionary) {
            it(match_dictionary[key] + " photo(s) match query \"" + key + "\"", function () {
                s.parseStatement(key, "and");
                matches = 0;
                this.photos.each(function (model) {
                    if (s.truthTest(model)) {
                        ++matches;
                    }
                });
                expect(matches).toEqual(match_dictionary[key]);
            });
        }
    });

});
