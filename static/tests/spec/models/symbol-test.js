var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols",
    rootDir + "lib/lgPalettes"
],
    function (Layer, Symbol, Symbols, LGPalettes) {
        'use strict';
            const initModels = function (scope) {
                scope.uniform = new Symbol({
                    "title": "Uniform Symbol",
                    "rule": "*",
                    "id": 1
                });
                scope.categorical = new Symbol({
                    "title": "Uniform Symbol",
                    "rule": "*",
                    "id": 1
                });
                scope.continuous = new Symbol({
                    "title": "Uniform Symbol",
                    "rule": "*",
                    "id": 1
                });
                scope.individual = new Symbol({
                    "title": "Uniform Symbol",
                    "rule": "*",
                    "id": 1
                });
            };
            const initSpies = function () {
                spyOn(Symbol.prototype, 'initialize').and.callThrough();
            };

        describe("SymbolModel static methods:", function () {
            beforeEach(function () {
                initSpies();
                //initModel(this);
            });

            it("createCategoricalSymbol() works", function () {
                const lgPalettes = new LGPalettes();
                const palette = lgPalettes.getPalette(2, 8, 'categorical');
                const symbol = Symbol.createCategoricalSymbol('cottonwood', this.categoricalLayer, 10, 3, palette);
                expect(symbol.get('fillColor')).toEqual('#33a02c');
                expect(symbol.get('fillOpacity')).toEqual(1);
                expect(symbol.get('rule')).toEqual("type = 'cottonwood'");
                expect(symbol.get('title')).toEqual("cottonwood");
                expect(symbol.get('strokeWeight')).toEqual(1);
                expect(symbol.get('strokeOpacity')).toEqual(1);
                expect(symbol.get('strokeColor')).toEqual('#ffffff');
                expect(symbol.get('height')).toEqual(20);
            });

            it("defaultIfUndefined() works", function () {
                expect(Symbol.defaultIfUndefined(0, 999)).toEqual(0);
                expect(Symbol.defaultIfUndefined(1, 999)).toEqual(1);

                expect(Symbol.defaultIfUndefined(undefined, 999)).toEqual(999);
                expect(Symbol.defaultIfUndefined(null, 999)).toEqual(999);
                expect(Symbol.defaultIfUndefined('', 999)).toEqual(999);
            });

        });
        describe("SymbolModel initialization:", function () {
            beforeEach(function () {
                initSpies();
                initModels(this);
            });
            it("initializes defaults", function () {
                expect(this.uniform.defaults).toEqual({
                    fillOpacity: 1,
                    width: 20,
                    height: 20,
                    fillColor: "#4e70d4",
                    strokeColor: "#FFFFFF",
                    strokeWeight: 1,
                    strokeOpacity: 1,
                    shape: "circle",
                    isShowing: true
                });
            });
        });
    });
