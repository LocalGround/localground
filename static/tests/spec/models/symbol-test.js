var rootDir = '../../';
define([
    rootDir + 'models/layer',
    rootDir + 'models/symbol',
    rootDir + 'collections/symbols',
    rootDir + 'lib/lgPalettes'
],
    function (Layer, Symbol, Symbols, LGPalettes) {
        'use strict';
            const initModels = function (scope) {
                scope.uniform = new Symbol({
                    title: 'Uniform Symbol',
                    rule: '*',
                    id: 1
                });
                scope.categorical = new Symbol({
                    title: 'Maple',
                    rule: 'type = \'maple\'',
                    id: 1,
                    paletteId: 0
                });
                scope.continuous = new Symbol({
                    title: 'between 0 and 21',
                    rule: 'height >= 0 and height < 21',
                    id: 1,
                    paletteId: 0
                });
                scope.individual = new Symbol({
                    title: 'Jamie\'s House',
                    rule: 'id = 106',
                    id: 1,
                });
            };
            const initSpies = function () {
                spyOn(Symbol.prototype, 'initialize').and.callThrough();
            };

        describe('SymbolModel static methods:', function () {
            beforeEach(function () {
                initSpies();
            });

            it('createCategoricalSymbol() works', function () {
                const layerModel = this.categoricalLayer;
                const symbol = Symbol.createCategoricalSymbol({
                    layerModel: layerModel,
                    category: 'cottonwood',
                    id: layerModel.getSymbols().getNextId(),
                    fillColor: layerModel.getSymbols().getNextColor()
                });
                expect(symbol.get('fillColor')).toEqual('#ff0029');
                expect(symbol.get('fillOpacity')).toEqual(1);
                expect(symbol.get('rule')).toEqual('type = \'cottonwood\'');
                expect(symbol.get('title')).toEqual('cottonwood');
                expect(symbol.get('strokeWeight')).toEqual(1);
                expect(symbol.get('strokeOpacity')).toEqual(1);
                expect(symbol.get('strokeColor')).toEqual('#ffffff');
                expect(symbol.get('height')).toEqual(20);
                expect(symbol.get('id')).toEqual(7);
            });

            it('createContinuousSymbol() works', function () {
                const layerModel = this.continuousLayer;
                const symbol = Symbol.createContinuousSymbol({
                    layerModel: layerModel,
                    rule: 'height >= 86 and height <= 100',
                    title: 'between 86 and 100',
                    fillColor: layerModel.getSymbols().getNextColor(),
                    id: layerModel.getSymbols().getNextId()
                });
                expect(symbol.get('fillColor')).toEqual('#08519c');
                expect(symbol.get('fillOpacity')).toEqual(1);
                expect(symbol.get('rule')).toEqual('height >= 86 and height <= 100');
                expect(symbol.get('title')).toEqual('between 86 and 100');
            });

            it('createIndividualSymbol() works', function () {
                const layerModel = this.individualLayer;
                const symbol = Symbol.createIndividualSymbol({
                    layerModel: layerModel,
                    category: 555,
                    fillColor: '#CCCCCC',
                    id: layerModel.getSymbols().getNextId()
                });
                expect(symbol.get('fillColor')).toEqual('#CCCCCC');
                expect(symbol.get('fillOpacity')).toEqual(1);
                expect(symbol.get('rule')).toEqual('id = 555');
                expect(symbol.get('title')).toEqual('555');
            });

            it('createIndividualSymbol() works (override title)', function () {
                const layerModel = this.individualLayer;
                const symbol = Symbol.createIndividualSymbol({
                    layerModel: layerModel,
                    category: 555,
                    title: 'Jimmy\'s House',
                    fillColor: '#CCCCCC',
                    id: layerModel.getSymbols().getNextId()
                });
                expect(symbol.get('title')).toEqual('Jimmy\'s House');
            });

            it('createUncategorizedSymbol() works', function () {
                const layerModel = this.continuousLayer;
                const symbol = Symbol.createUncategorizedSymbol({
                    layerModel: layerModel,
                    id: 999
                });
                expect(symbol.get('fillColor')).toEqual(Symbol.UNCATEGORIZED_SYMBOL_COLOR);
                expect(symbol.get('rule')).toEqual(Symbol.UNCATEGORIZED_SYMBOL_RULE);
                expect(symbol.get('id')).toEqual(999);
                expect(symbol.get('title')).toEqual('Other / No value');
            });

            it('createUniformSymbol() works', function () {
                const layerModel = this.uniformLayer;
                const symbol = Symbol.createUniformSymbol(layerModel, 999);
                expect(symbol.get('fillColor')).toEqual('#4e70d4');
                expect(symbol.get('rule')).toEqual('*');
                expect(symbol.get('id')).toEqual(999);
                expect(symbol.get('title')).toEqual('All Items');
            });

            it('defaultIfUndefined() works', function () {
                expect(Symbol.defaultIfUndefined(0, 999)).toEqual(0);
                expect(Symbol.defaultIfUndefined(1, 999)).toEqual(1);

                expect(Symbol.defaultIfUndefined(undefined, 999)).toEqual(999);
                expect(Symbol.defaultIfUndefined(null, 999)).toEqual(999);
                expect(Symbol.defaultIfUndefined('', 999)).toEqual(999);
            });

        });
        describe('SymbolModel initialization:', function () {
            beforeEach(function () {
                initSpies();
                initModels(this);
            });
            it('initializes defaults', function () {
                const defaults = {
                    fillOpacity: 1,
                    width: 20,
                    height: 20,
                    fillColor: '#4e70d4',
                    strokeColor: '#FFFFFF',
                    strokeWeight: 1,
                    strokeOpacity: 1,
                    shape: 'circle',
                    isShowing: true
                };
                expect(this.uniform.defaults).toEqual(defaults);
                expect(this.categorical.defaults).toEqual(defaults);
                expect(this.continuous.defaults).toEqual(defaults);
                expect(this.individual.defaults).toEqual(defaults);
            });
        });
    });
