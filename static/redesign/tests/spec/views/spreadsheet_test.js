var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form) {
        'use strict';
        var fixture;
        var newSpreadsheet;

        var initSpies = function () {

        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Form Successfully created", function () {
                newSpreadsheet = new Sreadsheet();
            });

        });

    }
);
