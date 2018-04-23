var rootDir = "../../";
define([
    "jquery",
    rootDir + "apps/style/views/right/marker-style-view",
    rootDir + "apps/style/views/symbols/symbol-selection-layout-view",
    rootDir + "models/layer"
],
    function ($, MarkerStyleView, SymbolSelectionLayoutView, Layer) {
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
                spyOn(MarkerStyleView.prototype, 'buildPropertiesList').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'hideColorRamp').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'selectDataType').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'contData').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateGlobalShape').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateWidth').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeWeight').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeOpacity').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateStrokeColor').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'createCorrectSymbols').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'render').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'setSelectedProp').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'getContInfo').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildContinuousSymbols').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'setSymbols').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'updateMapAndRender').and.callThrough();

                spyOn(MarkerStyleView.prototype, 'catData').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'getCatInfo').and.callThrough();
                spyOn(MarkerStyleView.prototype, 'buildCategoricalSymbols').and.callThrough();


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

                //global property
                continuousMarkerStyleView.selectedProp = "test_integer";

            },

            initCategoricalView = function (that) {
                //initialize categorical MarkerStyleView object:
                categoricalMarkerStyleView = new MarkerStyleView({
                    app: that.app,
                    model: that.testMap.get("layers").at(2)//,
                });
                categoricalMarkerStyleView.render();

                //set fixture:
                categoricalFixture = setFixtures('<div></div>');
                categoricalFixture.append(categoricalMarkerStyleView.$el);

                //global property
                categoricalMarkerStyleView.selectedProp = "test_text";

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
                expect(MarkerStyleView.prototype.updateMapAndRender).toHaveBeenCalledTimes(1);

                //sets properties:
                expect(categoricalMarkerStyleView.model).toEqual(this.testMap.get("layers").at(2));
                expect(categoricalMarkerStyleView.dataType).toEqual(this.testMap.get("layers").at(2).get("layer_type"));
                expect(categoricalMarkerStyleView.dataset).toEqual(this.testMap.get("layers").at(2).get("dataset"));
            });

            it("should listen for events", function () {
                expect(MarkerStyleView.prototype.selectDataType).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.hideColorRamp).toHaveBeenCalledTimes(0);
                expect(MarkerStyleView.prototype.render).toHaveBeenCalledTimes(3);

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

            /*
            it(" 'updateGlobalShape()' should update marker shape", function () {
                $(categoricalFixture.find(".global-marker-shape option[value='square']").change());
                expect(categoricalMarkerStyleView.model.get("metadata").shape).toEqual("square");
                expect(categoricalMarkerStyleView.updateGlobalShape).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.updateMetadata).toHaveBeenCalledTimes(1);
            });
            */

            it(" 'showSymbols()' should create symbol view", function() {
                expect(categoricalFixture).not.toContainElement('.symbols-layout-container');
                $(categoricalFixture.find('.selected-symbol-div').click());
                expect(categoricalMarkerStyleView.symbolsView).toEqual(jasmine.any(SymbolSelectionLayoutView));
                expect(categoricalFixture).toContainElement('.symbols-layout-container');
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

        });

        describe("Tests specific to a categorical layer: ", function () {
            beforeEach(function () {
                initSpies(this);
                initCategoricalView(this);
            });

            it("should build the correct column list", function () {
                categoricalMarkerStyleView.buildPropertiesList();
                expect(categoricalMarkerStyleView.categoricalList).toEqual([
                    { text: "Test Text", value: "test_text", hasData: true },
                    { text: 'Test Boolean', value: 'test_boolean', hasData: true },
                    { text: 'Test Choice', value: 'test_choice', hasData: true }

                ]);

                expect(categoricalFixture.find("#cat-prop").find("option:eq(0)").val()).toEqual("test_text");
                expect(categoricalFixture.find("#cat-prop").find("option:eq(1)").val()).toEqual("test_boolean");
                expect(categoricalFixture.find("#cat-prop").find("option:eq(2)").val()).toEqual("test_choice");
            });

            it("should select correct color palette", function () {
                $(categoricalFixture.find('#palette_3').click());
                expect(categoricalMarkerStyleView.model.get("metadata").paletteId).toEqual(3);
            });

            it("should execute catData", function () {
                expect(categoricalMarkerStyleView.catData).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.getCatInfo).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.buildCategoricalSymbols).toHaveBeenCalledTimes(1);
                expect(categoricalMarkerStyleView.setSymbols).toHaveBeenCalledTimes(1);

                $(categoricalFixture.find('#cat-prop').change().val("test_text"));

                expect(categoricalMarkerStyleView.catData).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.getCatInfo).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.buildCategoricalSymbols).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.setSymbols).toHaveBeenCalledTimes(2);
                expect(categoricalMarkerStyleView.setSelectedProp).toHaveBeenCalledWith("#cat-prop");
            });

            it("getCatInfo() should return correct information", function () {
                var info = categoricalMarkerStyleView.getCatInfo();
                expect(info.list[0]).toEqual("Blue team");
                expect(info.list[1]).toEqual("Green team");
                expect(info.list[2]).toEqual("Red team");

                expect(info.instanceCount["Blue team"]).toEqual(1);
                expect(info.instanceCount["Green team"]).toEqual(1);
                expect(info.instanceCount["Red team"]).toEqual(1);
            });

            it("buildCategoricalSymbols() should return list of symbols", function() {
                var info = categoricalMarkerStyleView.getCatInfo();
                var symbolsList = categoricalMarkerStyleView.buildCategoricalSymbols(info);
                var json = symbolsList.toJSON();
                json.forEach(function (symbol) {
                    delete symbol.icon;
                });
                expect(json).toEqual(this.categoricalSymbols);

            });


            it("sets newly created symbols to the view's collection and model", function () {
                var info = categoricalMarkerStyleView.getCatInfo(),
                symbolsList = categoricalMarkerStyleView.buildCategoricalSymbols(info);

                expect(categoricalMarkerStyleView.updateMapAndRender).toHaveBeenCalledTimes(1);
                categoricalMarkerStyleView.setSymbols(symbolsList);

                expect(categoricalMarkerStyleView.collection).toEqual(symbolsList);
                expect(categoricalMarkerStyleView.model.get("symbols")).toEqual(symbolsList.toJSON());
                expect(categoricalMarkerStyleView.updateMapAndRender).toHaveBeenCalledTimes(2);
            });

            it("should build correct palette list", function () {
                categoricalMarkerStyleView.buildPalettes(3);
                expect(categoricalMarkerStyleView.model.get("metadata").paletteId).toEqual(3);
                expect(categoricalMarkerStyleView.model.get("metadata").buckets).toEqual(3);
                expect(categoricalMarkerStyleView.selectedColorPalette).toEqual(["fbb4ae", "b3cde3", "ccebc5"]);
            });

            it("showPalettes function should display and hide list of palettes", function() {

                $(categoricalFixture.find('.palette-wrapper')).css('display', 'none');
                expect(categoricalFixture.find(".palette-wrapper").css('display')).toEqual('none');

                $(categoricalFixture.find('.selected-palette-wrapper').click());
                expect(categoricalFixture.find(".palette-wrapper").css('display')).toEqual('block');

                $('body').click();
                expect($(categoricalFixture.find('.palette-wrapper')).css('display')).toEqual('none');
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

        describe("Tests specific to a continuous layer: ", function () {
            beforeEach(function () {
                initSpies(this);
                initContinuousView(this);
            });

            it("should build the correct column list", function () {
                continuousMarkerStyleView.buildPropertiesList();
                expect(continuousMarkerStyleView.continuousList).toEqual([
                    { text: "Test Integer", value: "test_integer", hasData: true },
                    { text: "Test Rating", value: "test_rating", hasData: true }
                ]);


                expect(continuousFixture.find("#cont-prop").find("option:eq(0)").val()).toEqual("test_integer");
                expect(continuousFixture.find("#cont-prop").find("option:eq(1)").val()).toEqual("test_rating");
            });

            it("should select correct color palette", function () {
                $(continuousFixture.find('#palette_3').click());
                expect(continuousMarkerStyleView.model.get("metadata").paletteId).toEqual(3);
            });

            it("should execute contData", function () {
                expect(continuousMarkerStyleView.contData).toHaveBeenCalledTimes(1);
                $(continuousFixture.find('#cont-prop').change().val("test_integer"));
                expect(continuousMarkerStyleView.contData).toHaveBeenCalledTimes(2);

                expect(continuousMarkerStyleView.setSelectedProp).toHaveBeenCalledWith("#cont-prop");

                expect(continuousMarkerStyleView.getContInfo).toHaveBeenCalledTimes(2);
                expect(continuousMarkerStyleView.buildContinuousSymbols).toHaveBeenCalledTimes(2);
                expect(continuousMarkerStyleView.setSymbols).toHaveBeenCalledTimes(2);
            });

            it("getContInfo() should return correct information", function () {
                var info = continuousMarkerStyleView.getContInfo();
                var buckets = continuousMarkerStyleView.model.get("metadata").buckets;
                expect(info.min).toEqual(4);
                expect(info.max).toEqual(12);
                expect(info.range).toEqual(8);
                expect(info.segmentSize).toEqual(8/buckets);
                expect(info.currentFloor).toEqual(4);
            });

            it("buildContinuousSymbols() should return list of symbols", function() {
                var info = continuousMarkerStyleView.getContInfo();
                var symbolsList = continuousMarkerStyleView.buildContinuousSymbols(info);
                //console.log(info, symbolsList, symbolsList.length,  continuousMarkerStyleView.model.get("metadata").buckets);
                //console.log(symbolsList);
                var json = symbolsList.toJSON();
                json.forEach(function (symbol) {
                    delete symbol.icon;
                });
                var b = this.testMap.get("layers").at(0).get("symbols");
                b.forEach(function (symbol) {
                    delete symbol.icon;
                });
                //console.log(json);
                //console.log( this.continuousSymbols);
                //console.log(this.testMap.get("layers").at(0).get("symbols"));
                //$$$ leaving this fialing test in until that i can configure the appropriate test data
                expect(json).toEqual(this.continuousSymbols);
            });


            it("sets newly created symbols to the view's collection and model", function () {
                var info = continuousMarkerStyleView.getContInfo(),
                symbolsList = continuousMarkerStyleView.buildContinuousSymbols(info);

                expect(continuousMarkerStyleView.updateMapAndRender).toHaveBeenCalledTimes(1);
                continuousMarkerStyleView.setSymbols(symbolsList);

                expect(continuousMarkerStyleView.collection).toEqual(symbolsList);
                expect(continuousMarkerStyleView.model.get("symbols")).toEqual(symbolsList.toJSON());
                expect(continuousMarkerStyleView.updateMapAndRender).toHaveBeenCalledTimes(2);
            });

            it("should build correct palette list", function () {
                continuousMarkerStyleView.buildPalettes();
                expect(continuousMarkerStyleView.model.get("metadata").paletteId).toEqual(2);
                expect(continuousMarkerStyleView.model.get("metadata").buckets).toEqual(3);
                expect(continuousMarkerStyleView.selectedColorPalette).toEqual(["f0f0f0", "bdbdbd", "636363"]);
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
