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

            // Event handler functions
            spyOn(Spreadsheet.prototype, 'doSearch').and.callThrough();
            spyOn(Spreadsheet.prototype, 'clearSearch').and.callThrough();
            spyOn(Spreadsheet.prototype, 'renderSpreadsheet').and.callThrough();
            spyOn(Spreadsheet.prototype, 'addRow').and.callThrough();
            spyOn(Spreadsheet.prototype, 'attachModels').and.callThrough();
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

            // Turn that it into a describe for collection tests
            //Test with photos, audio, and records collections:
            describe("Setting collections: ", function(){
                it("Successfully set photo collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.photos
                    });
                    expect(newSpreadsheet.collection).toBeDefined();
                });

                it("Successfully set audio collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.audioFiles
                    });
                    expect(newSpreadsheet.collection).toBeDefined();
                });

                it("Successfully set markers collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.markers
                    });
                    expect(newSpreadsheet.collection).toBeDefined();
                });

                it("Successfully set records collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.form_1
                    });
                    // However, the example provided does not contain any fields
                    expect(newSpreadsheet.collection).toBeDefined();
                });
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

            describe("Spreadsheet listens for even handlers", function(){

                /*
                  Requires a sample collection with fields to make that work
                */
                it("Successfully calls doSearch", function () {
                    //TODO:
                    newSpreadsheet = new Spreadsheet({
                        app: this.app
                    });
                    //expect(1).toEqual(1);

                    // trigger collection set and make render be called
                    newSpreadsheet.app.vent.trigger("search-requested");
                    expect(Spreadsheet.prototype.doSearch).toHaveBeenCalledTimes(1);
                });

                it ("Successfully calls clearSearch", function(){
                    newSpreadsheet = new Spreadsheet({
                        app: this.app
                    });
                    //expect(1).toEqual(1);

                    // trigger collection set and make render be called
                    newSpreadsheet.app.vent.trigger("clear-search");
                    expect(Spreadsheet.prototype.clearSearch).toHaveBeenCalledTimes(1);
                });
            });


        });

    }
);
