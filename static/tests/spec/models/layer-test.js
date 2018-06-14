var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols"
],
    function (Layer, Symbol, Symbols) {
        'use strict';
        const initSpies = function () {
            spyOn(Layer.prototype, 'initialize').and.callThrough();
            spyOn(Layer.prototype, 'isCategorical').and.callThrough();
            spyOn(Layer.prototype, 'isContinuous').and.callThrough();
            spyOn(Layer.prototype, 'isUniform').and.callThrough();
            spyOn(Layer.prototype, 'isIndividual').and.callThrough();
            spyOn(Layer.prototype, 'url').and.callThrough();
            spyOn(Layer.prototype, 'set').and.callThrough();
            spyOn(Layer.prototype, 'getSymbols').and.callThrough();
            spyOn(Layer.prototype, 'setSymbols').and.callThrough();
            spyOn(Layer.prototype, 'replaceSymbols').and.callThrough();
            spyOn(Layer.prototype, 'applyDefaults').and.callThrough();
            spyOn(Layer.prototype, 'hideSymbols').and.callThrough();
            spyOn(Layer.prototype, 'showSymbols').and.callThrough();
            spyOn(Layer.prototype, 'isEmpty').and.callThrough();
            spyOn(Layer.prototype, 'toJSON').and.callThrough();
        };

        describe("LayerModel initialization:", function () {
            beforeEach(function () {
                initSpies();
            });

            it("should call all initialization functions", function () {
                expect(this.layer.get("symbols").length).toEqual(6);
            });

            it("should initialize defaults correctly", function () {
                expect(this.layer.defaults).toEqual({
                    name: 'Untitled',
                    isVisible: false,
                    metadata: {
                        buckets: 4,
                        paletteId: 0,
                        fillOpacity: 1,
                        width: 20,
                        fillColor: "#4e70d4",
                        strokeColor: "#ffffff",
                        strokeWeight: 1,
                        strokeOpacity: 1,
                        shape: "circle",
                        isShowing: false
                    }
                });
            });

            it("should apply defaults to new Layer correctly", function () {
                var newLayer = new Layer({ map_id: this.map.id });
                expect(newLayer.get("metadata")).toEqual({
                    buckets: 4,
                    paletteId: 0,
                    fillOpacity: 1,
                    width: 20,
                    fillColor: "#4e70d4",
                    strokeColor: "#ffffff",
                    strokeWeight: 1,
                    strokeOpacity: 1,
                    shape: "circle",
                    isShowing: false
                });
                expect(newLayer.get("symbols")).toBeUndefined();
            });

            it("should set urlRoot correctly", function () {
                expect(this.layer.urlRoot).toEqual("/api/0/maps/" + this.layer.get("map_id") + "/layers");
            });
        });

        describe("LayerModel instance methods:", function () {
            beforeEach(function () {
                initSpies();
            });

            it("getSymbols should return a Symbols collection", function () {
                expect(this.layer.getSymbols()).toEqual(jasmine.any(Symbols));
                expect(this.layer.getSymbols().length).toEqual(6);
            });

            it("setting the symbols attribute should regenreate the Symbols collection", function () {
                this.layer.setSymbols([{
                    "id": 100,
                    "title": "cat",
                    "rule": "a = 1"
                }, {
                    "id": 101,
                    "title": "dog",
                    "rule": "b = 5"
                }]);
                expect(this.layer.getSymbols().length).toEqual(2);
                expect(this.layer.getSymbols().length).toEqual(2);
                expect(this.layer.getSymbols().at(0).get("id")).toBe(100);
                expect(this.layer.getSymbols().at(0).get("title")).toBe("cat");
                expect(this.layer.getSymbols().at(0).get("rule")).toBe("a = 1");
                expect(this.layer.getSymbols().at(1).get("id")).toBe(101);
                expect(this.layer.getSymbols().at(1).get("title")).toBe("dog");
                expect(this.layer.getSymbols().at(1).get("rule")).toBe("b = 5");
            });

            it("showSymbols() and hideSymbols() shows and hides all symbols", function () {
                this.layer.getSymbols().each(function (symbol) {
                    expect(symbol.isShowingOnMap).toBeFalsy();
                });
                this.layer.showSymbols();
                this.layer.getSymbols().each(function (symbol) {
                    expect(symbol.isShowingOnMap).toBeTruthy();
                });
                this.layer.hideSymbols();
                this.layer.getSymbols().each(function (symbol) {
                    expect(symbol.isShowingOnMap).toBeFalsy();
                });
            });

            it("serializes nested JSON correctly for API POST / PUT / PATCH", function () {
                var json = this.layer.toJSON();
                expect(json.symbols).toEqual(JSON.stringify(this.layer.getSymbols().toJSON()));
                expect(json.metadata).toEqual(JSON.stringify(this.layer.get("metadata")));
                expect(json.filters).toEqual(JSON.stringify(this.layer.get("filters")));
            });

            it('initialize() works', function () {
                expect(1).toEqual(0);
            });
            it('isCategorical() works', function () {
                expect(1).toEqual(0);
            });
            it('isContinuous() works', function () {
                expect(1).toEqual(0);
            });
            it('isUniform() works', function () {
                expect(1).toEqual(0);
            });
            it('isIndividual() works', function () {
                expect(1).toEqual(0);
            });
            it('url() works', function () {
                expect(1).toEqual(0);
            });
            it('set() works', function () {
                expect(1).toEqual(0);
            });
            it('getSymbols() works', function () {
                expect(1).toEqual(0);
            });
            it('setSymbols() works', function () {
                expect(1).toEqual(0);
            });
            it('replaceSymbols() works', function () {
                expect(1).toEqual(0);
            });
            it('applyDefaults() works', function () {
                expect(1).toEqual(0);
            });
            it('hideSymbols() works', function () {
                expect(1).toEqual(0);
            });
            it('showSymbols() works', function () {
                expect(1).toEqual(0);
            });
            it('isEmpty() works', function () {
                expect(1).toEqual(0);
            });
            it('toJSON() works', function () {
                expect(1).toEqual(0);
            });
        });
    });
