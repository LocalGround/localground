define(["jquery", "lib/sqlParser", "../../test/spec-helper"], function ($, SQLParser) {
    'use strict';
    var valid_statements = [
            'where a = 3',
            'where name = dog',
            'where tags contains dog or tags contains cat',
            'id in (1, 2) or id in (3)'
        ],
        invalid_statements = [
            'acontains b',
            'a likeb',
            'ainb',
            'random sentance',
            'name = dog or name = cat or frog',
            'name = dog or frog',
            'where a = 3 and a'
        ];

    describe("SQLParser: Test valid SQL statements", function () {
        $.each(valid_statements, function () {
            var statement = this,
                sqlParser = null;
            it("SQL statement is valid for: \"" + statement + "\"", function () {
                sqlParser = new SQLParser(statement);
                expect(sqlParser.failureFlag).toEqual(0);
            });
        });
    });

    describe("SQLParser: Test invalid SQL statements", function () {
        $.each(invalid_statements, function () {
            var statement = this,
                sqlParser = null;
            it("SQL statement is invalid for: \"" + statement + "\"", function () {
                sqlParser = new SQLParser(statement);
                expect(sqlParser.failureFlag).toEqual(1);
            });
        });
    });

    describe("SQLParser: Test that where clause conjunctions work (AND / OR)", function () {
        var match_dictionary = {
                "where name = dog and name = cat": 0,
                "name = dog or name = cat or name = frog": 3,
                "name = dog or name = cat or frog": 0, //misuse of conjunctions
                "name = dog or frog": 0, //misuse of conjunctions
                "name in dog, frog or name = cat": 3, //correct, but non-standard use of in clause
                "name in ('dog', 'frog') and tags = amphibian": 1,
                "name in ('dog', 'frog') and tags = amphibian or tags = cute": 2,
                "tags endswith cute and tags startswith 'animal'": 2,
                "dasdsadsadsadsadsadsa": 0
            },
            key,
            matches = 0;
        for (key in match_dictionary) {
            it(match_dictionary[key] + " photo(s) match query \"" + key + "\"", function () {
                var sqlParser = new SQLParser(key);
                matches = 0;
                this.photos.each(function (model) {
                    if (sqlParser.checkModel(model)) {
                        ++matches;
                    }
                });
                expect(matches).toEqual(match_dictionary[key]);
            });
        }
    });
});
