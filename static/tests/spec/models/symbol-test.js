var rootDir = '../../';
define([
    rootDir + 'models/layer',
    rootDir + 'models/symbol',
    rootDir + 'collections/symbols',
    rootDir + 'lib/maps/overlays/icon'
],
    function (Layer, Symbol, Symbols, Icon) {
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
                scope.uncategorized = new Symbol({
                    title: 'Other / No value',
                    rule: Symbol.UNCATEGORIZED_SYMBOL_RULE,
                    id: 1,
                });
            };
            const initSpies = function () {
                spyOn(Symbol.prototype, 'initialize').and.callThrough();
                spyOn(Icon.prototype, 'initialize').and.callThrough();
            };

        describe('SymbolModel static methods and properties:', function () {
            beforeEach(function () {
                initSpies();
            });

            it('Has requisite static properties', function () {
                expect(Symbol.UNIFORM_SYMBOL_COLOR).toEqual('#4e70d4');
                expect(Symbol.INDIVIDUAL_SYMBOL_COLOR).toEqual('#ed867d');
                expect(Symbol.UNCATEGORIZED_SYMBOL_COLOR).toEqual('#BBB');
                expect(Symbol.UNCATEGORIZED_SYMBOL_RULE).toEqual('¯\\_(ツ)_/¯');
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

            it('initialize() works', function () {
                expect(1).toEqual(0);
            });
        });

        describe('SymbolModel instance methods:', function () {
            beforeEach(function () {
                initModels(this);
                initSpies();
            });

            it('set() regenerates Icon for select properties', function () {
                //expect(1).toEqual(0);
                expect(Icon.prototype.initialize).toHaveBeenCalledTimes(0);
                expect(this.uniform.get('icon')).toBeDefined();
                this.uniform.set('fillColor', '#CCC');
                this.uniform.set('strokeColor', '#EEE');
                this.uniform.set('shape', 'pin');
                this.uniform.set('fillOpacity', 0.8);
                this.uniform.set('strokeOpacity', 0.9);
                this.uniform.set('width', 50);
                this.uniform.set('strokeWeight', 3);
                expect(Icon.prototype.initialize).toHaveBeenCalledTimes(7);
                this.uniform.set('title', 'My New Title');
                expect(Icon.prototype.initialize).toHaveBeenCalledTimes(7);
                expect(this.uniform.get('icon').toJSON()).toEqual({
                    fillColor: '#CCC',
                    fillOpacity: 0.8,
                    strokeColor: '#EEE',
                    strokeWeight: 3,
                    strokeOpacity: 0.9,
                    path: 'M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z',
                    markerSize: 50,
                    scale: 10/3.0,
                    viewBox: '-1.5 -1.5 18 18',
                    width: 50,
                    height: 50
                });
            });

            it('setHeight() works', function () {
                expect(this.uniform.get('width')).toEqual(20);
                expect(this.uniform.get('height')).toEqual(20);
                this.uniform.set('width', 50);
                expect(this.uniform.get('width')).toEqual(50);
                expect(this.uniform.get('height')).toEqual(50);
            });

            it('toJSON() removes the "icon" property', function () {
                expect(this.uniform.get('icon')).toBeDefined();
                const json = this.uniform.toJSON();
                expect(json['rule']).toBeDefined();
                expect(json['title']).toBeDefined();
                expect(json['icon']).not.toBeDefined();
            });

            it('toSVG() works', function () {
                this.uniform.set('fillColor', '#CCC');
                this.uniform.set('strokeColor', '#EEE');
                this.uniform.set('shape', 'pin');
                this.uniform.set('fillOpacity', 0.8);
                this.uniform.set('strokeOpacity', 0.9);
                this.uniform.set('width', 50);
                this.uniform.set('strokeWeight', 3);
                expect(this.uniform.toSVG()).toEqual(`<svg viewBox="-1.5 -1.5 18 18" width="23" height="23">
                    <path fill="#CCC" stroke-linejoin="round"
                        stroke-linecap="round" paint-order="stroke"
                        stroke-width="3" stroke="#EEE" d="M14,7.5c0,3.5899-2.9101,6.5-6.5,6.5S1,11.0899,1,7.5S3.9101,1,7.5,1S14,3.9101,14,7.5z">
                    </path>
                </svg>`);
            });

            it('checkModel() works', function () {
                const record = this.dataset_2.at(0);
                expect(this.categorical.checkModel(record)).toBeFalsy();
                record.set('type', 'maple');
                expect(this.categorical.checkModel(record)).toBeTruthy();
            });

            it('addModel() works', function () {
                const record = this.dataset_2.at(0);
                expect(this.categorical.getModels().length).toEqual(0);
                this.categorical.addModel(record);
                expect(this.categorical.getModels().length).toEqual(1);
            });

            it('isEmpty() works', function () {
                const record = this.dataset_2.at(0);
                expect(this.categorical.isEmpty()).toBeTruthy();
                this.categorical.addModel(record);
                expect(this.categorical.isEmpty()).toBeFalsy();
            });

            it('removeModel() works', function () {
                const record = this.dataset_2.at(0);
                expect(this.categorical.getModels().length).toEqual(0);
                this.categorical.addModel(record);
                expect(this.categorical.containsRecord(record)).toBeTruthy();
                this.categorical.removeModel(record);
                expect(this.categorical.containsRecord(record)).toBeFalsy();
            });

            it('isUncategorized() works', function () {
                expect(this.categorical.isUncategorized()).toBeFalsy();
                expect(this.continuous.isUncategorized()).toBeFalsy();
                expect(this.uniform.isUncategorized()).toBeFalsy();
                expect(this.individual.isUncategorized()).toBeFalsy();
                expect(this.uncategorized.isUncategorized()).toBeTruthy();
            });

            it('isRemovalCandidate() works', function () {
                expect(1).toEqual(0);
                /*
                isRemovalCandidate: function (record) {
                    // returns true if the symbol contains the record and either:
                    //  a) the record doesn't match or
                    //  b) it's an uncategorized symbol with only one record:

                    const result = (
                        this.containsRecord(record) && (
                            !this.checkModel(record) || (
                                this.isUncategorized() &&
                                this.matchedModels.length <= 1
                            )
                        )
                    );
                    return result;
                }
                */
            });

            it('hasModels() works', function () {
                expect(1).toEqual(0);
            });

            it('getModels() works', function () {
                expect(1).toEqual(0);
            });

            it('getModelsJSON() works', function () {
                expect(1).toEqual(0);
            });


        })
    });
