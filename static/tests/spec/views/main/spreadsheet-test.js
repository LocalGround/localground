var rootDir = "../../";
define([
    "handlebars",
    rootDir + "../apps/main/views/spreadsheet/spreadsheet",
    rootDir + "../models/form",
    rootDir + "../collections/records",
    rootDir + "../lib/carousel/carousel",
    "tests/spec-helper1"
],
    function (Handlebars, Spreadsheet, Form, Records, Carousel) {
        'use strict';
        var fixture;
        var newSpreadsheet;

        var setupSpreadsheetTest = function (scope) {
            fixture = setFixtures('<div style="width:800px;height:600px"></div>');
            // add spies:
            spyOn(Spreadsheet.prototype, 'render').and.callThrough();
            spyOn(Spreadsheet.prototype, 'initialize').and.callThrough();

            // Carousel to catch initalize
            spyOn(Carousel.prototype, "initialize");

            scope.collection = scope.dataset_3;
            scope.spreadsheet = new Spreadsheet({
                app: scope.app,
                collection: scope.collection,
                fields: scope.collection.getFields(),
                layer: scope.uniformLayer,
                height: $(window).height() - 180
            });
            scope.spreadsheet.render();
            fixture.append(scope.spreadsheet.$el);
        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                setupSpreadsheetTest(this);
            });

            it("Spreadsheet Successfully created", function () {
                expect(this.spreadsheet).toEqual(jasmine.any(Spreadsheet));
                expect(this.spreadsheet.collection.length).toBe(this.collection.length);
                expect(this.spreadsheet.collection).toEqual(jasmine.any(Records));
            });

            it("Renders all the rows", function () {
                //not sure why twice as many rows. Must be a HOT thing
                this.spreadsheet.render();
                fixture.append(this.spreadsheet.$el);
                this.spreadsheet.renderSpreadsheet();
                expect(this.spreadsheet.$el.find('.htCore tbody tr').length).toEqual(this.collection.length * 2);
                expect(this.collection.length).toEqual(5);
            });

            it("addRow Works", function () {
                //not sure why twice as many rows. Must be a HOT thing
                this.spreadsheet.renderSpreadsheet();
                this.spreadsheet.addRow()
                expect(this.spreadsheet.$el.find('.htCore tbody tr').length).toEqual(this.collection.length * 2);
                expect(this.collection.length).toEqual(6);
            });

        });


        // describe("Spreadsheet listens for even handlers", function(){
        //     beforeEach(function(){
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.form_1,
        //             fields: this.fields
        //         });
        //     });
        //     it("Successfully calls doSearch", function () {
        //
        //         newSpreadsheet.app.vent.trigger("search-requested", "blah");
        //         expect(Spreadsheet.prototype.doSearch).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("Successfully calls clearSearch", function(){
        //
        //         newSpreadsheet.app.vent.trigger("clear-search");
        //         expect(Spreadsheet.prototype.clearSearch).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("Successfully calls renderSpreadsheet", function(){
        //         newSpreadsheet.app.vent.trigger("render-spreadsheet");
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
        //     });
        //
        //     it("Successfully calls addRow", function(){
        //         newSpreadsheet.app.vent.trigger("add-row");
        //         expect(Spreadsheet.prototype.addRow).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("Successfully calls attachModels", function(){
        //         var models = [];
        //         this.photos.each(function(model){
        //             models.push(model);
        //         });
        //         newSpreadsheet.currentModel = this.form_1.at(0);
        //         newSpreadsheet.app.vent.trigger("add-models-to-marker", models);
        //         expect(Spreadsheet.prototype.attachModels).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("Successfully calls Collection -> add", function(){
        //         newSpreadsheet.collection.trigger("add");
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
        //     });
        //
        //     it("Successfully calls Collection -> reset", function(){
        //         newSpreadsheet.collection.trigger("reset");
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(2);
        //     });
        // });

        // describe("Spreadsheet: Rendering the spreadsheet", function(){
        //     beforeEach(function(){
        //         setupSpreadsheetTest(this);
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.form_1,
        //             fields: this.fields
        //         });
        //     });
        //
        //     it("Successfully calls getColumns", function(){
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
        //         expect(Spreadsheet.prototype.getColumns).toHaveBeenCalledTimes(1);
        //
        //     });
        //
        //     it("Successfully calls getColumnHeaders", function(){
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
        //         expect(Spreadsheet.prototype.getColumnHeaders).toHaveBeenCalledTimes(1);
        //     });
        //
        //     it("Successfully calls getColumnWidths", function(){
        //         expect(Spreadsheet.prototype.renderSpreadsheet).toHaveBeenCalledTimes(1);
        //         expect(Spreadsheet.prototype.getColumnWidths).toHaveBeenCalledTimes(1);
        //     });
        //
        // });

        // describe("Spreadsheet: Clickable functions", function(){
        //
        //     var triggerAddField = function(){
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.showCreateFieldForm).toHaveBeenCalledTimes(0);
        //         newSpreadsheet.$el.find('#addColumn').trigger('click');
        //         expect(Spreadsheet.prototype.showCreateFieldForm).toHaveBeenCalledTimes(1);
        //     };
        //
        //     var triggerMediaBrowser = function(){
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.showMediaBrowser).toHaveBeenCalledTimes(0);
        //         newSpreadsheet.$el.find('.addMedia').trigger('click');
        //         expect(Spreadsheet.prototype.showMediaBrowser).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
        //     };
        //
        //     var triggerDeleteField = function(){
        //         newSpreadsheet.show_hide_deleteColumn = true;
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(0);
        //         newSpreadsheet.$el.find('.delete_column').trigger('click', {
        //             currentTarget: $(".delete_column").get(0)
        //         });
        //     };
        //
        //     beforeEach(function(done){
        //         setupSpreadsheetTest(this);
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.form_1,
        //             fields: this.fields
        //         });
        //         newSpreadsheet.app.dataType = 'form_1';
        //         loadStyleFixtures('../../../../css/modal_new_project.css');
        //         setTimeout(function () { done(); }, 10);
        //     });
        //
        //     it("Shows the Create Field Form", function () {
        //         triggerAddField();
        //     });
        //
        //     describe("Spreadsheet Create Field Form Tests", function(){
        //         it ("Opens the Modal Window", function(){
        //             expect(this.app.vent.trigger).toHaveBeenCalledTimes(0);
        //             triggerAddField();
        //             expect(this.app.vent.trigger).toHaveBeenCalledTimes(1);
        //
        //         });
        //     });
        //
        //     it("Shows the Media Browser", function(){
        //         triggerMediaBrowser();
        //     });
        //
        //     describe("Spreadsheet Show Media Browser Tests", function(){
        //         it ("Opens the Modal Window", function(){
        //             expect(this.app.vent.trigger).toHaveBeenCalledTimes(0);
        //             triggerMediaBrowser();
        //             expect(this.app.vent.trigger).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
        //
        //         });
        //     });
        //
        //     describe("Spreadsheet Delete Field Test", function(){
        //         it("Does not delete field", function(){
        //             spyOn(window, 'confirm').and.returnValue(false);
        //             triggerDeleteField();
        //             expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(newSpreadsheet.fields.length * 2);
        //         });
        //         it("Does delete field", function(){
        //             spyOn(window, 'confirm').and.returnValue(true);
        //             triggerDeleteField();
        //             expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(1);
        //         });
        //     });
        //
        // });

        // describe("Spreadsheet Carousel Click Functions", function(){
        //
        //     beforeEach(function(){
        //         setupSpreadsheetTest(this);
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.form_1,
        //             fields: this.fields
        //         });
        //
        //     });
        //
        //     var triggerCarousel = function(){
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.carouselMedia).toHaveBeenCalledTimes(0);
        //         $(document.querySelector('.carousel-media')).trigger('click');
        //         expect(Spreadsheet.prototype.carouselMedia).toHaveBeenCalledTimes(1);
        //     };
        //
        //     it("Shows the Carousel Audio", function(){
        //         triggerCarousel();
        //     });
        // });

        // describe("Spreadsheet: Renderer functions", function(){
        //
        //     beforeEach(function(){
        //         setupSpreadsheetTest(this);
        //     });
        //
        //     it("Go through the Button renderer", function(){
        //         this.app.dataType = "markers";
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.markers
        //         });
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.render();
        //         expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
        //         expect(Spreadsheet.prototype.buttonRenderer).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
        //     });
        //
        //     it("Go through the Thumbnail renderer", function() {
        //         this.app.dataType = "photos";
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.photos
        //         });
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.thumbnailRenderer)
        //             .toHaveBeenCalledTimes(newSpreadsheet.collection.length * 2);
        //     });
        //
        //     it("Go through the Audio renderer", function () {
        //         this.app.dataType = "audio";
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.audioFiles,
        //         });
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.renderSpreadsheet();
        //         expect(Spreadsheet.prototype.audioRenderer)
        //             .toHaveBeenCalledTimes(newSpreadsheet.collection.length * 2);
        //     });
        //
        //     it("Go through the Video renderer", function () {
        //         this.app.dataType = "videos";
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.videos,
        //         });
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.render();
        //         expect(Spreadsheet.prototype.videoRenderer)
        //             .toHaveBeenCalledTimes(newSpreadsheet.collection.length * 2);
        //     });
        //
        //     it("Go through the Rating renderer", function () {
        //         this.app.dataType = "form_1";
        //         newSpreadsheet = new Spreadsheet({
        //             app: this.app,
        //             collection: this.form_1,
        //             fields: this.fields
        //         });
        //         fixture.find('.main-panel').append(newSpreadsheet.$el);
        //         newSpreadsheet.render();
        //         expect(Spreadsheet.prototype.ratingRenderer)
        //             .toHaveBeenCalledTimes(4);
        //     });
        // });

    });
