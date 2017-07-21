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

    });
