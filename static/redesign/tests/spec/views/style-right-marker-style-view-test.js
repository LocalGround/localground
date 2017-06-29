var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/right/marker-style-view", 
    rootDir + "models/layer"
],
    function ($, MarkerStyleView, Layer) {
        'use strict';
        var markerStyleView,
            continuousMarkerStyleView,
            categoricalFixture,
            continuousFixture,
            categoricalMarkerStyleView,
            Layer,
            initSpies = function (that) {
                // 1) add spies for all relevant objects:
                spyOn(that.app.vent, 'trigger').and.callThrough();

                spyOn(MarkerStyleView.prototype, 'initialize').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildPalettes').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildColumnList').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'hideColorRamp').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'selectDataType').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'contData').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateGlobalShape').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateWidth').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeWeight').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeOpacity').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeColor').and.callThrough();

            },
            
            initContinuousView = function (that) {
                // initialize continuous MarkerStyleView object:
                continuousMarkerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.testMap.get("layers").at(0)
                });
                continuousMarkerStyleView.render();

                //set fixture:
                continuousFixture = setFixtures('<div></div>');
                continuousFixture.append(continuousMarkerStyleView.$el);

              
            },

            initCategoricalView = function (that) {
                //initialize categorical MarkerStyleView object:
                categoricalMarkerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.testMap.get("layers").at(2)
                });
                categoricalMarkerStyleView.render();

                //set fixture:
                categoricalFixture = setFixtures('<div></div>');
                categoricalFixture.append(categoricalMarkerStyleView.$el);

                //spies
                spyOn(categoricalMarkerStyleView, 'updateMetadata').and.callThrough(); 
            };


        describe("When MarkerStyleView is initialized", function () {
            beforeEach(function () {
                initSpies(this);
                initCategoricalView(this);
            });

            it("should set properties and call initialization methods", function () {
                //calls methods:
                expect(categoricalMarkerStyleView).toEqual(jasmine.any(MarkerStyleView));
                expect(MarkerStyleView.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildPalettes).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                //sets properties:
                expect(categoricalMarkerStyleView.model).toEqual(this.testMap.get("layers").at(2));
                expect(categoricalMarkerStyleView.dataType).toEqual(this.testMap.get("layers").at(2).get("layer_type"));
                expect(categoricalMarkerStyleView.data_source).toEqual(this.testMap.get("layers").at(2).get("data_source"));
            });

            it("should listen for events", function () {
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(1);

                categoricalMarkerStyleView.app.vent.trigger("update-data-source");
                expect(MarkerStyleView.prototype.buildColumnList).toHaveBeenCalledTimes(2);

                $('body').trigger("click");
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(1);

            });
        });
        describe("User interaction tests", function () {
            beforeEach(function () {
                initSpies(this);
                initCategoricalView(this);
            });

            it("should set correct data type", function () {
                expect(categoricalMarkerStyleView.selectDataType).toHaveBeenCalledTimes(0);
                
                $(categoricalFixture.find("#data-type-select option[value='continuous']").change());
                expect(categoricalMarkerStyleView.selectDataType).toHaveBeenCalledTimes(1);
                expect(MarkerStyleView.prototype.contData).toHaveBeenCalled();
                expect(categoricalMarkerStyleView.dataType).toEqual("continuous");
                
                $(categoricalFixture.find("#data-type-select").val("categorical")).change();
                expect(categoricalMarkerStyleView.selectDataType).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.dataType).toEqual("categorical");
            });

            it(" 'updateGlobalShape()' should update marker shape", function () {
                $(categoricalFixture.find(".global-marker-shape option[value='square']").change());
                expect(categoricalMarkerStyleView.model.get("metadata").shape).toEqual("square");
                expect(categoricalMarkerStyleView.updateGlobalShape).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(1);
            });

            it(" 'updateWidth()' should update width", function () {
                $(categoricalFixture.find("#marker-width").val("17").change());
                expect(categoricalMarkerStyleView.model.get("metadata").width).toEqual(17);
                expect(categoricalMarkerStyleView.updateWidth).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(1);
            });

            it(" 'updateStrokeWeight()' should update stroke weight", function () {
                $(categoricalFixture.find("#stroke-weight").val("4").change());
                expect(categoricalMarkerStyleView.model.get("metadata").strokeWeight).toEqual(4);
                expect(categoricalMarkerStyleView.updateStrokeWeight).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(1);
            });

            it(" 'updateStrokeOpacity' should update stroke opacity", function () {
                $(categoricalFixture.find("#stroke-opacity").val("0.4").change());
                expect(categoricalMarkerStyleView.model.get("metadata").strokeOpacity).toEqual(0.4);
                expect(categoricalMarkerStyleView.updateStrokeOpacity).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(1);

                //test when user inputs a value greater than 1, which is not allowed
                $(categoricalFixture.find("#stroke-opacity").val("2.4").change());
                expect(categoricalMarkerStyleView.model.get("metadata").strokeOpacity).toEqual(1);
                expect(categoricalMarkerStyleView.updateStrokeOpacity).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(2);

                //test when user inputs a value less than 0, which is not allowed
                $(categoricalFixture.find("#stroke-opacity").val("-2.4").change());
                expect(categoricalMarkerStyleView.model.get("metadata").strokeOpacity).toEqual(0);
                expect(categoricalMarkerStyleView.updateStrokeOpacity).toHaveBeenCalledTimes(3);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(3);
            });
            



            it("should build the correct column list", function () {
                //Trying to test that the appropriate list of fields
                //(categorical or continuous is built, 
                //when the data source is a form).
                //Having trouble working with the spec-helper data
                expect(categoricalMarkerStyleView.categoricalList).toEqual([{
                    text: "Test Text",
                    value: "test_text"
                }]);
            });

        });

         describe("Test timed functions", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousView(this);
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

            it(" 'updateStrokeColor()' should update stroke color ", function () {
                //open the color picker:
                $(continuousFixture.find('#stroke-color-picker').trigger("click"));
                jasmine.clock().tick(600);
                $(document).trigger("mousedown");
                expect(continuousMarkerStyleView.updateStrokeColor).toHaveBeenCalledTimes(1);

            });

            it("updateMap should trigger 'rebuild markers' ", function () {
                spyOn(continuousMarkerStyleView.model, "trigger").and.callThrough();
                continuousMarkerStyleView.updateMap();
                jasmine.clock().tick(300);
                // expect(Layer.prototype.trigger).toHaveBeenCalledWith("rebuild-markers");
                expect(continuousMarkerStyleView.model.trigger).toHaveBeenCalledWith("rebuild-markers");
            });

        });

        describe("Tests specific to a continuous layer", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousView(this);
            });

            it("should select correct color palette", function () {
                $(continuousFixture.find('#palette_3').click());
                expect(continuousMarkerStyleView.model.get("metadata").paletteId).toEqual(3);      
            });

            it("should execute contData and build continuous list", function () {
                $(continuousFixture.find('#cont-prop').change());
                expect(continuousMarkerStyleView.contData).toHaveBeenCalled();
                // need more tests here. having trouble again with the dataManager
                console.log(continuousMarkerStyleView.layerDraft.continuous);
            });

            it("should build correct palette list", function () {
                continuousMarkerStyleView.buildPalettes();
                expect(continuousMarkerStyleView.model.get("metadata").paletteId).toEqual(2); 
                expect(continuousMarkerStyleView.model.get("metadata").buckets).toEqual(5);  
                expect(continuousMarkerStyleView.selectedColorPalette).toEqual(["f7f7f7", "cccccc", "969696", "636363", "252525"]);
            });

            it("showPalettes function should display and hide list of palettes", function() {
            
               $(continuousFixture.find('.palette-wrapper')).css('display', 'none');
               expect(continuousFixture.find(".palette-wrapper").css('display')).toEqual('none');

                $(continuousFixture.find('.selected-palette-wrapper').click());
                expect(continuousFixture.find(".palette-wrapper").css('display')).toEqual('block');

                $('body').click();
                expect($(continuousFixture.find('.palette-wrapper')).css('display')).toEqual('none');
            });

        });
    });
