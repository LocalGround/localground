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
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();
            //spyOn(Spreadsheet.prototype, 'initModel').and.callThrough();
        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                initSpies();
            });

            it("Spreadsheet Successfully created", function () {
                newSpreadsheet = new Spreadsheet({
                    app: this.app
                });
                expect(newSpreadsheet).toEqual(jasmine.any(Spreadsheet));
            });
            
            it("Spreadsheet successfully sets the collection", function () {
                //Test with photos, audio, and records collections:
                newSpreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.photos
                });
                expect(1).toEqual(1);
            });

            it("Template created", function () {
                newSpreadsheet = new Spreadsheet({
                    app: this.app
                });
                expect(newSpreadsheet.template).toEqual(jasmine.any(Function));
            });

            it("Render gets called", function () {
                newSpreadsheet = new Spreadsheet({
                    app: this.app
                });
                expect(Spreadsheet.prototype.render).toHaveBeenCalledTimes(1);
            });
            
            it("Spreadsheet listens for event handlers", function () {
                //TODO:
                newSpreadsheet = new Spreadsheet({
                    app: this.app
                });
                expect(1).toEqual(1);
            });

        });

    }
);
