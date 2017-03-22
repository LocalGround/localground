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
            spyOn(Spreadsheet.prototype, 'render').and.callThrough();
            //spyOn(Spreadsheet.prototype, 'initModel').and.callThrough();
        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Spreadsheet Successfully created", function () {
                newSpreadsheet = new Sreadsheet();
                //expect(newCreateForm.model).toEqual(jasmine.any(Spreadsheet));
                // How do I confirm that Spreadsheet is new spreadsheet?
            });

            it("Template created", function () {
                newSpreadsheet = new Sreadsheet();
                expect(newCreateForm.template).toEqual(jasmine.any(Function));
            });

            it("Render gets called", function () {
                newSpreadsheet = new Sreadsheet();
                expect(newCreateForm.model).toEqual(jasmine.any(Spreadsheet));
                expect(CreateForm.prototype.render).toHaveBeenCalledTimes(0);
            });

        });

    }
);
