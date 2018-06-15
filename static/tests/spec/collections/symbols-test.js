var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "collections/symbols"
],
    function (Layer, Symbol, Symbols) {
        'use strict';
        const initSpies = function () {
            spyOn(Symbols.prototype, 'initialize').and.callThrough();
            spyOn(Symbols.prototype, 'getNextId').and.callThrough();
            spyOn(Symbols.prototype, 'removeEmpty').and.callThrough();
            spyOn(Symbols.prototype, 'removeStaleMatches').and.callThrough();
            spyOn(Symbols.prototype, 'getNumMatches').and.callThrough();
            spyOn(Symbols.prototype, 'updateIfApplicable').and.callThrough();
            spyOn(Symbols.prototype, 'assignToExistingSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'assignToNewSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'getUncategorizedSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'hasUncategorizedSymbol').and.callThrough();
            spyOn(Symbols.prototype, 'assignRecords').and.callThrough();
            spyOn(Symbols.prototype, 'assignRecord').and.callThrough();
            spyOn(Symbols.prototype, 'reassignRecord').and.callThrough();
            spyOn(Symbols.prototype, 'toSVGList').and.callThrough();
        };

        describe("SymbolCollection initialization:", function () {
            beforeEach(function () {
                initSpies();
            });

            it('initialize() works', function () {
                expect(Symbols.prototype.initialize).toHaveBeenCalledTimes(0);
                const layer = new Layer({
                    map_id: this.map.id
                });
                const symbols = new Symbols(null, {layerModel: layer});
                expect(Symbols.prototype.initialize).toHaveBeenCalledTimes(1);
            });

            it('initialize() throws error when parent model not passed in', function () {
                expect(function () {
                    const symbols = new Symbols(null);
                }).toThrow(new Error('A layerModel must be defined.'));
            });

        });

        describe("SymbolCollection instance methods:", function () {
            beforeEach(function () {
                initSpies();
            });

            it('getNextId() works', function () {
                const symbols = this.categoricalLayer.getSymbols()
                expect(symbols.map(item => item.id)).toEqual([ 1, 2, 3, 4, 5, 6 ]);
                expect(symbols.getNextId()).toEqual(7);

                // get next id for non-sequential IDs
                symbols.at(3).set('id', 98);
                expect(symbols.map(item => item.id)).toEqual([ 1, 2, 3, 98, 5, 6 ]);
                expect(symbols.getNextId()).toEqual(99);

                //get next ID for empty symbols:
                const layer = new Layer({
                    map_id: this.map.id
                });
                const newSymbols = new Symbols(null, {layerModel: layer});
                expect(newSymbols.getNextId()).toEqual(1);
            });
            it('removeEmpty() works', function () {
                const palette = this.categoricalLayer.getPalette();
                const symbols = this.categoricalLayer.getSymbols();
                this.categoricalLayer.setSymbols([
                    { title: 'cat', rule: 'type = \'cat\'', fillColor: '#' + palette[0] },
                    { title: 'dog', rule: 'type = \'dog\'', fillColor: '#' + palette[1] },
                    { title: 'bird', rule: 'type = \'bird\'', fillColor: '#' + palette[2] },
                    { title: 'pig', rule: 'type = \'pig\'', fillColor: '#' + palette[3] },
                    { title: 'chicken', rule: 'type = \'chicken\'', fillColor: '#' + palette[4] },
                    { title: 'lamb', rule: 'type = \'lamb\'', fillColor: '#' + palette[5] },
                    { title: 'monkey', rule: 'type = \'monkey\'', fillColor: '#' + palette[6] },
                    { title: 'fish', rule: 'type = \'fish\'', fillColor: '#' + palette[7] }
                ]);
                expect(symbols.length).toEqual(8);
                symbols.removeEmpty();
                expect(symbols.length).toEqual(1);
                expect(symbols.hasUniformSymbol()).toBeTruthy();
                expect(this.categoricalLayer.isUniform()).toBeTruthy();

            });
            it('removeStaleMatches() works', function () {
                expect(1).toEqual(0);
            });
            it('getNumMatches() works', function () {
                expect(1).toEqual(0);
            });
            it('updateIfApplicable() works', function () {
                expect(1).toEqual(0);
            });
            it('assignToExistingSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('assignToNewSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('getUncategorizedSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('hasUncategorizedSymbol() works', function () {
                expect(1).toEqual(0);
            });
            it('assignRecords() works', function () {
                expect(1).toEqual(0);
            });
            it('assignRecord() works', function () {
                expect(1).toEqual(0);
            });
            it('reassignRecord() works', function () {
                expect(1).toEqual(0);
            });
            it('toSVGList() works', function () {
                expect(1).toEqual(0);
            });
        });
    });
