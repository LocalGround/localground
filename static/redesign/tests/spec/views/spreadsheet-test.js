var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio, Markers, Records) {
        'use strict';
        var fixture;
        var newSpreadsheet;

        var initSpies = function () {
            spyOn(Spreadsheet.prototype, 'render').and.callThrough();
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();
            spyOn(Spreadsheet.prototype, 'saveChanges').and.callThrough();

            // Event handler functions
            spyOn(Spreadsheet.prototype, 'doSearch').and.callThrough();
            spyOn(Spreadsheet.prototype, 'clearSearch').and.callThrough();
            spyOn(Spreadsheet.prototype, 'renderSpreadsheet').and.callThrough();
            spyOn(Spreadsheet.prototype, 'addRow').and.callThrough();
            spyOn(Spreadsheet.prototype, 'attachModels').and.callThrough();

            // functions involving renderers
            spyOn(Spreadsheet.prototype, "thumbnailRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "audioRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "buttonRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "mediaCountRenderer").and.callThrough();

            // column functions
            spyOn(Spreadsheet.prototype, "getColumns").and.callThrough();
            spyOn(Spreadsheet.prototype, "getColumnHeaders").and.callThrough();
            spyOn(Spreadsheet.prototype, "getColumnWidths").and.callThrough();
            spyOn(Spreadsheet.prototype, "getModelFromCell").and.callThrough();

            // clickable functions
            spyOn(Spreadsheet.prototype, "showCreateFieldForm").and.callThrough();
            spyOn(Spreadsheet.prototype, "showMediaBrowser").and.callThrough();
            spyOn(Spreadsheet.prototype, "deleteField").and.callThrough();
            spyOn(Spreadsheet.prototype, "carouselAudio").and.callThrough();
            spyOn(Spreadsheet.prototype, "carouselPhoto").and.callThrough();

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
                    expect(newSpreadsheet.collection.length).toBe(this.photos.length);
                    expect(newSpreadsheet.collection).toEqual(jasmine.any(Photos));
                });

                it("Successfully set audio collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.audioFiles
                    });
                    expect(newSpreadsheet.collection.length).toBe(this.audioFiles.length);
                    expect(newSpreadsheet.collection).toEqual(jasmine.any(Audio));
                });

                it("Successfully set markers collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.markers
                    });
                    expect(newSpreadsheet.collection.length).toBe(this.markers.length);
                    expect(newSpreadsheet.collection).toEqual(jasmine.any(Markers));
                });

                it("Successfully set records collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.form_1
                    });
                    expect(newSpreadsheet.collection.length).toBe(this.form_1.length);
                    expect(newSpreadsheet.collection).toEqual(jasmine.any(Records));
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
                beforeEach(function(){
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.form_1,
                        fields: this.fields
                    });
                });
                it("Successfully calls doSearch", function () {

                    newSpreadsheet.app.vent.trigger("search-requested");
                    expect(Spreadsheet.prototype.doSearch).toHaveBeenCalledTimes(1);
                });

                it("Successfully calls clearSearch", function(){

                    newSpreadsheet.app.vent.trigger("clear-search");
                    expect(Spreadsheet.prototype.clearSearch).toHaveBeenCalledTimes(1);
                });

                it("Successfully calls renderSpreadsheet", function(){
                    newSpreadsheet.app.vent.trigger("render-spreadsheet");
                    expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
                });

                it("Successfully calls addRow", function(){
                    newSpreadsheet.app.vent.trigger("add-row");
                    expect(Spreadsheet.prototype.addRow).toHaveBeenCalledTimes(1);
                });

                it("Successfully calls attachModels", function(){
                    // Unforntunately, this one requires digging into oen of the elements
                    // inside field so that it can actually gather the collection of models
                    // for the "added media" column
                    var models = [];
                    this.photos.each(function(model){
                        models.push(model);
                    });
                    newSpreadsheet.currentModel = this.form_1.at(0);
                    newSpreadsheet.app.vent.trigger("add-models-to-marker", models);
                    expect(Spreadsheet.prototype.attachModels).toHaveBeenCalledTimes(1);
                });

                // Even triggers form collection:

                it("Successfully calls Collection -> add", function(){
                    newSpreadsheet.collection.trigger("add");
                    expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
                });

                it("Successfully calls Collection -> reset", function(){
                    newSpreadsheet.collection.trigger("reset");
                    expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
                });
            });


        });

        describe("Spreadsheet: Rendering the spreadsheet", function(){
            beforeEach(function(){
                initSpies();
                newSpreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.form_1,
                    fields: this.fields
                });
            });

            it("Successfully calls getColumns", function(){
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                expect(Spreadsheet.prototype.getColumns).toHaveBeenCalledTimes(1);

            });

            it("Successfully calls getColumnHeaders", function(){
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                expect(Spreadsheet.prototype.getColumnHeaders).toHaveBeenCalledTimes(1);
            });

            it("Successfully calls getColumnWidths", function(){
                expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
                expect(Spreadsheet.prototype.getColumnWidths).toHaveBeenCalledTimes(1);
            });

            describe("Render Spreadsheet: Saving settings", function(){

            });

        });

    }
);
