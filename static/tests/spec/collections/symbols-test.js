var rootDir = "../../";
define([
    rootDir + "models/layer",
    rootDir + "models/symbol",
    rootDir + "models/record",
    rootDir + "collections/symbols"
],
    function (Layer, Symbol, Record, Symbols) {
        'use strict';
        const initSpies = function () {
            spyOn(Symbols.prototype, 'initialize').and.callThrough();
            spyOn(Symbols.prototype, 'getNextId').and.callThrough();
            spyOn(Symbols.prototype, 'removeEmpty').and.callThrough();
            spyOn(Symbols.prototype, '__removeStaleMatches').and.callThrough();
            spyOn(Symbols.prototype, '__getNumMatches').and.callThrough();
            spyOn(Symbols.prototype, '__updateIfApplicable').and.callThrough();
            spyOn(Symbols.prototype, '__assignToExistingSymbol').and.callThrough();
            spyOn(Symbols.prototype, '__assignToNewSymbol').and.callThrough();
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
            it('__removeStaleMatches(record, symbol) works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                const symbol = symbols.at(0);
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                expect(this.categoricalLayer.isEmpty()).toBeTruthy();
                symbols.assignRecords(records);
                const record = symbol.getModels().at(0);
                expect(symbol.getModels().length).toEqual(2);
                record.set('type', 'peach tree');
                symbols.__removeStaleMatches(record);
                expect(symbol.getModels().length).toEqual(1);
            });
            it('__getNumMatches() works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                const record = records.at(0);
                expect(symbols.__getNumMatches(record)).toEqual(1);
            });
            it('__updateIfApplicable(record) works', function () {
                //Make sure that if there is only 1 record in a symbol and the
                //record changes, modify the symbol:
                const symbols = this.categoricalLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                symbols.assignRecords(records);
                const symbolCandidate = symbols.at(2); //symbol w/only 1 record
                const record = symbolCandidate.getModels().at(0);
                expect(symbolCandidate.get('rule')).toEqual('type = \'spruce\'');
                expect(symbolCandidate.get('title')).toEqual('spruce');
                record.set('type', 'redwood');
                symbols.__updateIfApplicable(record);
                expect(symbolCandidate.get('rule')).toEqual('type = \'redwood\'');
                expect(symbolCandidate.get('title')).toEqual('redwood');
            });
            it('__assignToExistingSymbol(record) / assignRecord(record) works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                symbols.assignRecords(records);
                const symbol = symbols.findWhere({ rule: 'type = \'oak\''});
                const record = records.at(0);
                expect(symbol.getModels().length).toEqual(7);
                record.set('type', 'Oak');
                symbols.assignRecord(record);
                expect(symbol.getModels().length).toEqual(8);
            });
            it('Categorical: __assignToNewSymbol(record) / assignRecord(record) works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                const record = records.at(0);
                symbols.assignRecords(records);
                expect(symbols.findWhere({ rule: 'type = \'ABCDEFG\''})).toBeUndefined();
                record.set('type', 'ABCDEFG');
                expect(symbols.length).toEqual(6);
                symbols.assignRecord(record);
                expect(symbols.length).toEqual(7);
                const symbol = symbols.findWhere({ rule: 'type = \'ABCDEFG\''});
                expect(symbol).toEqual(symbols.at(5));
            });
            it('Individual: __assignToNewSymbol(record) / assignRecord(record) works', function () {
                const symbols = this.individualLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.individualLayer.get('dataset').overlay_type
                )
                const record = new Record({id: 777, type: 'ABCDEFG'});
                symbols.assignRecords(records);
                expect(symbols.length).toEqual(18);
                expect(symbols.findWhere({ rule: 'id =777'})).toBeUndefined();
                records.add(record);
                symbols.assignRecord(record);
                expect(symbols.length).toEqual(19);
            });
            it('Continuous: __assignToNewSymbol(record) / assignRecord(record) works', function () {
                const symbols = this.continuousLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.continuousLayer.get('dataset').overlay_type
                );
                expect(symbols.length).toEqual(5);
                expect(symbols.findWhere({ rule: 'height = 999'})).toBeUndefined();
                const record = new Record({id: 777, rule: 'height = 999'});
                records.add(record);
                symbols.assignRecord(record);
                //note: it shouldn't create a new symbol, but instead be filed into uncategorized.
                expect(symbols.length).toEqual(5);
                expect(symbols.at(4).isUncategorized()).toBeTruthy();
            });
            it('getUncategorizedSymbol() works', function () {
                const symbols = this.continuousLayer.getSymbols();
                expect(symbols.getUncategorizedSymbol().isUncategorized()).toBeTruthy();
            });
            it('hasUncategorizedSymbol() works', function () {
                let symbols = this.continuousLayer.getSymbols();
                expect(symbols.hasUncategorizedSymbol()).toBeTruthy();
                symbols = this.categoricalLayer.getSymbols();
                expect(symbols.hasUncategorizedSymbol()).toBeTruthy();
                symbols = this.individualLayer.getSymbols();
                expect(symbols.hasUncategorizedSymbol()).toBeFalsy();
                symbols = this.uniformLayer.getSymbols();
                expect(symbols.hasUncategorizedSymbol()).toBeFalsy();
            });
            it('assignRecords() works', function () {
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(0);
                let symbols = this.continuousLayer.getSymbols();
                const records = this.dataManager.getCollection(
                    this.continuousLayer.get('dataset').overlay_type
                );
                symbols.assignRecords(records);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(18);
            });
            it('reassignRecord() works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                const symbol = symbols.at(0);
                const records = this.dataManager.getCollection(
                    this.categoricalLayer.get('dataset').overlay_type
                )
                symbols.assignRecords(records);
                const record = symbol.getModels().at(0);
                expect(symbol.getModels().length).toEqual(2);
                record.set('type', 'peach tree');
                expect(Symbols.prototype.__updateIfApplicable).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(18);
                expect(Symbols.prototype.__removeStaleMatches).toHaveBeenCalledTimes(0);
                expect(Symbols.prototype.removeEmpty).toHaveBeenCalledTimes(1);
                symbols.reassignRecord(record);
                expect(symbol.getModels().length).toEqual(1);

                expect(Symbols.prototype.__updateIfApplicable).toHaveBeenCalledTimes(1);
                expect(Symbols.prototype.assignRecord).toHaveBeenCalledTimes(19);
                expect(Symbols.prototype.__removeStaleMatches).toHaveBeenCalledTimes(1);
                expect(Symbols.prototype.removeEmpty).toHaveBeenCalledTimes(2);
            });
            it('toSVGList() works', function () {
                const symbols = this.categoricalLayer.getSymbols();
                expect(symbols.toSVGList().length).toEqual(6);
                expect(symbols.toSVGList()[0]).toEqual(symbols.at(0).toSVG());
            });
        });
    });
