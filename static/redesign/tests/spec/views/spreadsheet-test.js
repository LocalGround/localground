var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/videos",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "lib/carousel/carousel",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio, Videos, Markers, Records, Carousel) {
        'use strict';
        var fixture;
        var newSpreadsheet;

        var setupSpreadsheetTest = function (scope) {
            fixture = setFixtures('<div id="toolbar-main"></div> \
                    <div id="toolbar-dataview" class="filter data"></div> \
                    <main class="main-panel"></main> \
                    <div id="carouselModal" class="carousel-modal spreadsheet">\
                      <span class="close big" onclick="document.getElementById(\'carouselModal\').style.display=\'none\'">\
                        &times;\
                      </span>\
                    </div>\
                    <div id="videoModal" class="modal">\
                      <span class="close big" onclick="document.getElementById(\'myModal\').style.display=\'none\'">\
                        &times;\
                      </span>\
                      <iframe class="modal-content spreadsheet" id="video-iframe" style="width: 70%; height: 480px;"></iframe>\
                      <div id="caption"></div>\
                    </div>\
                    ');
            spyOn(scope.app.vent, 'trigger').and.callThrough();

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
            spyOn(Spreadsheet.prototype, "videoRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "buttonRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "mediaCountRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "ratingRenderer").and.callThrough();
            spyOn(Spreadsheet.prototype, "showVideoModal").and.callThrough();

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
            spyOn(Spreadsheet.prototype, "carouselVideo").and.callThrough();

            // Carousel to catch initalize
            spyOn(Carousel.prototype, "initialize");

        };

        describe("Spreadsheet: Initialization Tests", function () {
            beforeEach(function () {
                setupSpreadsheetTest(this);
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

                it("Successfully set video collection", function () {
                    newSpreadsheet = new Spreadsheet({
                        app: this.app,
                        collection: this.videos
                    });
                    expect(newSpreadsheet.collection.length).toBe(this.videos.length);
                    expect(newSpreadsheet.collection).toEqual(jasmine.any(Videos));
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
                setupSpreadsheetTest(this);
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

        describe("Spreadsheet: Clickable functions", function(){

            var triggerAddField = function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.showCreateFieldForm).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('#addColumn').trigger('click');
                expect(Spreadsheet.prototype.showCreateFieldForm).toHaveBeenCalledTimes(1);
            };

            var triggerMediaBrowser = function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.showMediaBrowser).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('.addMedia').trigger('click');
                expect(Spreadsheet.prototype.showMediaBrowser).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
            };

            var triggerDeleteField = function(){
                newSpreadsheet.show_hide_deleteColumn = true;
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('.delete_column').trigger('click', {
                    currentTarget: $(".delete_column").get(0)
                });
            };

            beforeEach(function(done){
                setupSpreadsheetTest(this);
                newSpreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.form_1,
                    fields: this.fields
                });
                newSpreadsheet.app.dataType = 'form_1';
                loadStyleFixtures('../../../../css/modal_new_project.css');
                setTimeout(function () { done(); }, 10);
            });

            it("Shows the Create Field Form", function () {
                triggerAddField();
            });

            describe("Spreadsheet Create Field Form Tests", function(){
                it ("Opens the Modal Window", function(){
                    expect(this.app.vent.trigger).toHaveBeenCalledTimes(0);
                    triggerAddField();
                    expect(this.app.vent.trigger).toHaveBeenCalledTimes(1);

                });
            });

            it("Shows the Media Browser", function(){
                triggerMediaBrowser();
            });

            describe("Spreadsheet Show Media Browser Tests", function(){
                it ("Opens the Modal Window", function(){
                    expect(this.app.vent.trigger).toHaveBeenCalledTimes(0);
                    triggerMediaBrowser();
                    expect(this.app.vent.trigger).toHaveBeenCalledTimes(newSpreadsheet.collection.length);

                });
            });

            describe("Spreadsheer Delete Field Test", function(){

                it("Does not delete field", function(){
                    spyOn(window, 'confirm').and.returnValue(false);
                    triggerDeleteField();
                    expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(newSpreadsheet.fields.length * 2);
                });
                it("Does delete field", function(){
                    spyOn(window, 'confirm').and.returnValue(true);
                    triggerDeleteField();
                    expect(Spreadsheet.prototype.deleteField).toHaveBeenCalledTimes(1);
                });
            });



        });

        describe("Spreadsheet Carousel Click Functions", function(){

            beforeEach(function(){
                setupSpreadsheetTest(this);
                newSpreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.form_1,
                    fields: this.fields
                });

            });

            var triggerCarouselAudio = function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.carouselAudio).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('.carousel-audio').trigger('click');
                expect(Spreadsheet.prototype.carouselAudio).toHaveBeenCalledTimes(6);
            };

            var triggerCarouselPhoto = function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.carouselPhoto).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('.carousel-photo').trigger('click');
                expect(Spreadsheet.prototype.carouselPhoto).toHaveBeenCalledTimes(6);
            };

            var triggerCarouselVideo = function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.carouselVideo).toHaveBeenCalledTimes(0);
                newSpreadsheet.$el.find('.carousel-video').trigger('click');
                expect(Spreadsheet.prototype.carouselVideo).toHaveBeenCalledTimes(6);
            };

            it("Shows the Carousel Audio", function(){
                triggerCarouselAudio();
            });

            it("Shows the Carousel Photo", function(){
                triggerCarouselPhoto();
            });

            it("Shows the Carousel Video", function(){
                triggerCarouselVideo();
            });
        });

        describe("Spreadsheet: Renderer functions", function(){

            beforeEach(function(){
                setupSpreadsheetTest(this);
                newSpreadsheet = new Spreadsheet({
                    app: this.app
                });
            });

            it("Go through the Button renderer", function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.collection = this.form_1;
                newSpreadsheet.fields = this.fields;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.buttonRenderer).toHaveBeenCalledTimes(newSpreadsheet.collection.length);
            });

            it("Go through the Thumbnail renderer", function() {
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(0);
                newSpreadsheet.collection = this.photos;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.thumbnailRenderer).toHaveBeenCalledTimes(6);
            });

            it("Go through the Audio renderer", function () {
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(0);
                newSpreadsheet.collection = this.audioFiles;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.audioRenderer).toHaveBeenCalledTimes(6);
            });

            it("Go through the Video renderer", function () {
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(0);
                newSpreadsheet.collection = this.videos;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.videoRenderer).toHaveBeenCalledTimes(6);
            });

            it("Successfully displays the video from clicking on icon", function(){
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                newSpreadsheet.collection = this.videos;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.showVideoModal).toHaveBeenCalledTimes(0);
                var $testTumbnailYT = $(fixture.find("i.fa-vimeo, i.fa-youtube").get(0));
                $testTumbnailYT.trigger('click');
                expect(Spreadsheet.prototype.showVideoModal).toHaveBeenCalledTimes(1);

                //expect(1).toEqual(-1);
            });

            it("Go through the Media Count renderer", function () {
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(0);
                newSpreadsheet.fields = this.fields;
                newSpreadsheet.collection = this.form_1;
                newSpreadsheet.renderSpreadsheet();
                //these counts don't make sense. TODO: revisit.
                expect(Spreadsheet.prototype.mediaCountRenderer).toHaveBeenCalledTimes(4);
            });

            it("Go through the Rating renderer", function () {
                fixture.find('.main-panel').append(newSpreadsheet.$el);
                expect(Spreadsheet.prototype.ratingRenderer).toHaveBeenCalledTimes(0);
                newSpreadsheet.fields = this.fields;
                newSpreadsheet.collection = this.form_2;
                newSpreadsheet.renderSpreadsheet();
                expect(Spreadsheet.prototype.ratingRenderer).toHaveBeenCalledTimes(2);
            });
        });

        describe("Spreadsheet: Video Cell Updates", function(){
            beforeEach(function(){
                setupSpreadsheetTest(this);
                newSpreadsheet = new Spreadsheet({
                    app: this.app,
                    collection: this.videos
                });
                fixture.find('.main-panel').append(newSpreadsheet.$el);
            });

            it ("Sucessfully switch between different video providers from drop-down", function(){
                /*
                Check the following:

                Make sure that there is a video provider and video id column
                There should be a drop-down option at the "Provider" column

                After switching th e provider, the whole table should re-render
                and a new video icon should be displayed
                */

                var vidCols = newSpreadsheet.getColumnHeaders();
                //console.log(vidCols);
                expect(vidCols[6]).toEqual("Video ID");
                expect(vidCols[7]).toEqual("Provider");

                var providerRow = newSpreadsheet.table.getDataAtRow(0)
                console.log(providerRow);
                var targetCell = newSpreadsheet.table.getDataAtCell(0, 7);
                console.log(targetCell);
                newSpreadsheet.table.setDataAtCell(0, 7, "vimeo");
                var changedCell = newSpreadsheet.table.getDataAtCell(0, 5);
                expect(newSpreadsheet.table.getDataAtCell(0, 7)).toEqual(changedCell);
                console.log(changedCell, newSpreadsheet.table.getDataAtCell(0, 7));

                expect(1).toEqual(0);
            });
        });

    }
);
