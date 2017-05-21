var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols"
],
    function (Layer, Symbol, Symbols) {
        'use strict';
        var layer,
            initModel = function (scope) {
                //workaround to test model w/nested JSON:
                var json = scope.layer.toJSON();
                json.symbols = JSON.parse(json.symbols);
                layer = new Layer(json);
            },
            initSpies = function () {
                spyOn(Layer.prototype, 'initialize').and.callThrough();
                spyOn(Layer.prototype, 'applyDefaults').and.callThrough();
                spyOn(Layer.prototype, 'buildSymbolMap').and.callThrough();
                spyOn(Layer.prototype, 'rebuildSymbolMap').and.callThrough();
            };

        describe("When Layer Model Initializes, it...", function () {
            beforeEach(function () {
                initSpies();
                initModel(this);
            });

            it("should call all initialization functions", function () {
                expect(Layer.prototype.initialize).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.applyDefaults).toHaveBeenCalledTimes(1);
                expect(Layer.prototype.buildSymbolMap).toHaveBeenCalledTimes(1);
                expect(layer.get("symbols").length).toEqual(3);
            });

            it("should initialize defaults correctly", function () {
                expect(layer.defaults).toEqual({
                    name: 'Untitled',
                    isVisible: false,
                    metadata: {
                        buckets: 4,
                        paletteId: 0,
                        fillOpacity: 1,
                        width: 20,
                        fillColor: "#4e70d4",
                        strokeColor: "#4e70d4",
                        strokeWeight: 3,
                        strokeOpacity: 1,
                        shape: "circle"
                    },
                    symbols: []
                });
            });

            it("should apply defaults to new Layer correctly", function () {
                var newLayer = new Layer({ map_id: this.testMap.id });
                expect(newLayer.get("metadata")).toEqual({
                    buckets: 4,
                    paletteId: 0,
                    fillOpacity: 1,
                    width: 20,
                    fillColor: "#4e70d4",
                    strokeColor: "#4e70d4",
                    strokeWeight: 3,
                    strokeOpacity: 1,
                    shape: "circle"
                });
                expect(newLayer.get("symbols").length).toEqual(0);
            });

            it("should set urlRoot correctly", function () {
                expect(layer.urlRoot).toEqual("/api/0/maps/" + this.layer.get("map_id") + "/layers/");
            });
        });

        describe("When user requests symbols, it...", function () {
            beforeEach(function () {
                initSpies();
                initModel(this);
            });

            it("should build the symbol map correctly", function () {
                var key, counter = 0, symbolJSON;
                for (key in layer.symbolMap) {
                    symbolJSON = layer.get("symbols")[counter];
                    expect(key).toEqual('symbol_' + symbolJSON.id);
                    expect(layer.symbolMap[key]).toEqual(jasmine.any(Symbol));
                    expect(layer.symbolMap[key].get("id")).toEqual(new Symbol(symbolJSON).get("id"));
                    counter += 1;
                }
                expect(counter).toEqual(3);
                expect(layer.basic).toBeFalsy();
            });

            it("should call buildSymbolMap when rebuildSymbolMap called", function () {
                expect(Layer.prototype.buildSymbolMap).toHaveBeenCalledTimes(1);
                layer.rebuildSymbolMap();
                expect(Layer.prototype.buildSymbolMap).toHaveBeenCalledTimes(2);
            });

        });

        describe("Public method tests", function () {
            beforeEach(function () {
                initSpies();
                initModel(this);
            });

            it("getSymbols should return a Symbols collection", function () {
                expect(layer.getSymbols()).toEqual(jasmine.any(Symbols));
                expect(layer.getSymbols().length).toEqual(3);
            });
        });
    });
