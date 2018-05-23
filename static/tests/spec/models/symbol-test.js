var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols",
    rootDir + "lib/lgPalettes"
],
    function (Layer, Symbol, Symbols, LGPalettes) {
        'use strict';
            const initModel = function (scope) {
                //workaround to test model w/nested JSON:
                var json = scope.layer.toJSON();
                json.symbols = JSON.parse(json.symbols);
                symbol = new Symbol(json);
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

        
    });
