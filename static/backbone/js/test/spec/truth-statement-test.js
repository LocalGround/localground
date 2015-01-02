define(["jquery", "lib/truthStatement"], function ($, TruthStatement) {
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
            'random sentance'
        ];
    describe("Check conjunctions", function () {
        it("Check that conjunction is 'AND' or 'OR' keyword (case-insensitive)", function () {
            var s = new TruthStatement();
            //should throw an exception:
            expect(function () { s.setConjunction('blah'); }).toThrow();

            //should not throw an exception:
            expect(function () { s.setConjunction('and'); }).not.toThrow();
            expect(function () { s.setConjunction('or'); }).not.toThrow();
        });
    });

    describe("Check token splitting", function () {
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

    describe("Check operator validation", function () {
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

    describe("Checking overall parser (combination of the above tests)", function () {
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

});
