var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/right/marker-style-view"
],
    function ($, MarkerStyleView) {
        'use strict';
        var markerStyleView,
            continuousMarkerStyleView,
            fixture,
            continuousFixture,
            initView = function (that) {
                // 1) add spies for all relevant objects:
                spyOn(that.app.vent, 'trigger').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildPalettes').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildColumnList').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'hideColorRamp').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'selectDataType').and.callThrough();

                // 2) initialize categorical MarkerStyleView object:
                markerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.layer
                });
                markerStyleView.render();

                //initialize continuous MarkerStyleView object:
                continuousMarkerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.testMap.get("layers").at(2)
                });
                continuousMarkerStyleView.render();

                // 3) set fixture:
                fixture = setFixtures('<div></div>');
                fixture.append(markerStyleView.$el);

                continuousFixture = setFixtures('<div></div>');
                continuousFixture.append(continuousMarkerStyleView.$el);

            };

        describe("When MarkerStyleView is initialized", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should set properties and call initialization methods", function () {
                //calls methods:
                expect(markerStyleView).toEqual(jasmine.any(MarkerStyleView));
                expect(MarkerStyleView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildPalettes).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                //sets properties:
                expect(markerStyleView.model).toEqual(this.layer);
                expect(markerStyleView.dataType).toEqual(this.layer.get("layer_type"));
                expect(markerStyleView.data_source).toEqual(this.layer.get("data_source"));
            });

            it("should listen for events", function () {
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                markerStyleView.app.vent.trigger("update-data-source");
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(2);

                $('body').trigger("click");
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(1);

                markerStyleView.app.vent.trigger("find-datatype");
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(3);

            });
        });
        describe("User interaction tests", function () {
            beforeEach(function () {
                initView(this);
            });

            it("should set correct data type", function () {
                expect(markerStyleView.selectDataType).toHaveBeenCalledTimes(0);

                $(fixture.find("#data-type-select").val("continuous")).change();
                expect(markerStyleView.selectDataType).toHaveBeenCalledTimes(1);
                expect(markerStyleView.dataType).toEqual("continuous");

                $(fixture.find("#data-type-select").val("categorical")).change();
                expect(markerStyleView.selectDataType).toHaveBeenCalledTimes(2);
                expect(markerStyleView.dataType).toEqual("categorical");
            });

            it("should build the correct column list", function () {
                //Trying to test that the appropriate list of fields
                //(categorical or continuous is built, 
                //when the data source is a form).
                //Having trouble working with the spec-helper data
                expect(continuousMarkerStyleView.continuousList).toEqual({
                    col_alias: "Test Text",
                    col_name: "test_text"
                });
            });

            it("should select correct color palette", function () {
                $(continuousFixture.find('#palette_3').click());
                expect(continuousMarkerStyleView.model.get("metadata").paletteId).toEqual(3);      
            });
            
            
        });

         describe("Test timed functions", function () {
            beforeEach(function () {
                initView(this);
                jasmine.clock().install();
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            it("updateBuckets should correctly update layer metadata", function () {
                //sets model to a continuous layer
                $(continuousFixture.find('#bucket').change().val("7"));
                jasmine.clock().tick(600);
                expect(continuousMarkerStyleView.model.get("metadata").buckets).toEqual(7);      
            });
        });
    });
