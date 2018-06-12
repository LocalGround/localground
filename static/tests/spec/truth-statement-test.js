define(["jquery", "lib/truthStatement", "tests/spec-helper1"], function ($, TruthStatement) {
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
        const s1 = new TruthStatement("id = 1", "and");
        const s2 = new TruthStatement("name = 'dog'", "and");
        const match_dictionary = [
            {whereClause: "tags contains animal", count: 3},
            {whereClause: "tags contains 'animal'", count: 3},
            {whereClause: "tags startswith animal", count: 3},
            {whereClause: "tags startswith 'animal'", count: 3},
            {whereClause: "tags endswith 'dog'", count: 1},
            {whereClause: "name = dog", count: 1},
            {whereClause: "name = 'dog'", count: 1},
            {whereClause: "name = 'Dog'", count: 1},
            {whereClause: "name in ('Dog', 'Cat')", count: 2},
            {whereClause: "name in (dog, cat)", count: 2},
            {whereClause: "name in (dog1, cat)", count: 1},
            {whereClause: "name in dog, cat, Frog", count: 3}, //note: parenthesis, single quotes, case sensitivity optional
            {whereClause: "name like '%o%", count: 2},
            {whereClause: "name like '%o%'", count: 2},
            {whereClause: "name like 'd%", count: 1},
            {whereClause: "name like '%g'", count: 2},
            {whereClause: "id in (51,52,53)", count: 3},
            {whereClause: "id in ('51', '52', '53')", count: 3}, //even if user is confused about the datatype.
            {whereClause: "id <> 51", count: 4},
            {whereClause: "id != 52", count: 4},
            {whereClause: "id < 54", count: 3},
            {whereClause: "id <= 53", count: 3},
            {whereClause: "id >= 54", count: 2},
            {whereClause: "id > 52", count: 3},
            {whereClause: "id = 52", count: 1},
            {whereClause: "*", count: 5}
        ];
        const s = new TruthStatement();
        let key = null;
        let matches = 0;

        it("Successfully converts model value to comparison value", function () {
            var key1 = s1.key,
                key2 = s2.key,
                record = this.dataset_3.get(1),
                modelVal1 = this.dataset_3.get(key1),
                modelVal2 = this.dataset_3.get(key2),
                convertedVal1 = s1.convertType(modelVal1),
                convertedVal2 = s2.convertType(modelVal2);
            expect(typeof modelVal1).toEqual(typeof convertedVal1);
            expect(typeof modelVal2).toEqual(typeof convertedVal2);
        });

        it("Records do not match queries which are untrue", function () {
            var that = this;
            //valid_statements are valid, but not true:
            $.each(valid_statements, function () {
                var whereClause = this,
                    s = new TruthStatement(whereClause, "and"),
                    matches = 0;
                that.dataset_3.each(function (model) {
                    if (s.truthTest(model)) {
                        ++matches;
                    }
                });
                expect(matches).toEqual(0);
            });
        });

        match_dictionary.forEach(function(item) {
            it(item.count + " records(s) match query \"" + item.whereClause + "\"", function() {
                const s = new TruthStatement(item.whereClause, "and");
                let matches = 0;
                this.dataset_3.each(function (model) {
                    if (s.truthTest(model)) {
                        ++matches;
                    }
                });
                //console.log(matches === item.count, item.whereClause, matches, item.count);
                expect(matches).toEqual(item.count);
            });
        });
    });


});
