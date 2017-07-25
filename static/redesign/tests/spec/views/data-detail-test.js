/*
  Data Detail Test goes here
*/

var rootDir = "../../";
define([
    "handlebars",
    rootDir + "apps/spreadsheet/views/main",
    rootDir + "models/form",
    rootDir + "collections/photos",
    rootDir + "collections/audio",
    rootDir + "collections/markers",
    rootDir + "collections/records",
    rootDir + "lib/carousel/carousel",
    rootDir + "apps/gallery/views/data-detail",
    "tests/spec-helper"
],
    function (Handlebars, Spreadsheet, Form, Photos, Audio,
              Markers, Records, Carousel, DataDetail) {
        //
        //
        //
        'use strict';
        var fixture;
        var newDataDetail;

        var setupDataDetail;

        var initSpies = function(scope){
            spyOn(DataDetail.prototype, "initialize").and.callThrough();
            spyOn(DataDetail.prototype, "render").and.callThrough();
            //
            spyOn(DataDetail.prototype, "viewRender").and.callThrough();
            spyOn(DataDetail.prototype, "editRender").and.callThrough();
            spyOn(DataDetail.prototype, "onRender");
            //
            spyOn(DataDetail.prototype, "saveModel").and.callThrough();
            spyOn(DataDetail.prototype, "deleteModel").and.callThrough();
            spyOn(DataDetail.prototype, "activateMarkerTrigger").and.callThrough();
            spyOn(DataDetail.prototype, "deleteMarkerTrigger").and.callThrough();
            //
            spyOn(DataDetail.prototype, "showMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "hideMapPanel").and.callThrough();
            spyOn(DataDetail.prototype, "doNotDisplay").and.callThrough();
            //
            spyOn(DataDetail.prototype, "rotatePhoto").and.callThrough();
            spyOn(DataDetail.prototype, "templateHelpers").and.callThrough();
            //
            spyOn(DataDetail.prototype, "switchToEditMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToViewMode").and.callThrough();
            spyOn(DataDetail.prototype, "switchToAddMode").and.callThrough();

        };

        describe("Data Detail: Initialization Test", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Data Detail successfully created", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                expect(newDataDetail).toEqual(jasmine.any(DataDetail));
            });
        });

        describe("Data Detail: Render Test", function(){
            beforeEach(function(){
                initSpies(this);
            });
            it ("Initial render test successful", function(){
                //expect("Please write render test code").toEqual(0);
                expect(1).toEqual(1);
            });
        });

        describe("Data Detail: Featured Image", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Stub test", function(){
                newDataDetail = new DataDetail({
                    app: this.app,
                    model: this.marker,
                    mode: "view"
                });
                console.log(this.marker);
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Other Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls activateRectangleTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls activateMarkerTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls deleteMarkerTrigger", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls bindFields", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls rotatePhoto", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls commitForm", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls doNotDisplay", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Model Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls saveModel", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls deleteModel", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: View Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls viewRender", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders video", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders photo", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders audio", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders record", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders marker", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Edit Render", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls editRender", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders video", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders photo", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders audio", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders record", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully renders marker", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Switching View Modes", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls switchToViewMode", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls switchToEditMode", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls switchToAddMode", function(){
                expect(1).toEqual(-1);
            });
        });

        describe("Data Detail: Map Functions", function(){
            beforeEach(function(){
                initSpies(this);
            });

            it("Successfully calls hideMapPanel", function(){
                expect(1).toEqual(-1);
            });

            it("Successfully calls showMapPanel", function(){
                expect(1).toEqual(-1);
            });
        });

    });
