define(["underscore", "models/symbol", "collections/base", "lib/lgPalettes"],
    function (_, Symbol, Base, LGPalettes) {
    "use strict";
    /**
     * Note: There is no "Symbols" API Endpoint. This is just a convenience function
     *       for serializing layers
     */
    var Symbols = Base.extend({
        model: Symbol,
        name: 'Symbols',
        key: 'symbols',
        initialize: function (recs, opts) {
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, recs, opts);
        },
        maxId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            return Math.max(...this.models.map(symbol => symbol.get('id')))
        },
        assignRecords: function (records) {
            records.each(record => {
                this.assignRecord(record);
            });
        },
        assignRecord: function (record) {
            let matchedSymbol;
            this.each(symbol => {
                if (symbol.checkModel(record)) {
                    matchedSymbol = symbol;
                    symbol.addModel(record);
                }
            })
            if (!matchedSymbol) {
                matchedSymbol = this.handleUnmatchedRecord(record);
            }
            return matchedSymbol;
        },
        handleUnmatchedRecord: function (recordModel) {
            const uncategorizedSymbol = this.getOrCreateUncategorizedSymbolModel();
            uncategorizedSymbol.addModel(recordModel);
            return uncategorizedSymbol;
        },
        getUncategorizedSymbol: function () {
            return this.findWhere({
                rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
            });
        },
        createUncategorizedSymbol: function () {
            const uncategorizedSymbol = Symbol.createUncategorizedSymbol();
            this.add(uncategorizedSymbol);
            return uncategorizedSymbol;
        },
        getOrCreateUncategorizedSymbolModel: function () {
            const uncategorizedSymbol = this.getUncategorizedSymbol();
            if (!uncategorizedSymbol) {
                return this.createUncategorizedSymbol();
            }
            return uncategorizedSymbol;
        },
        appendNewSymbol: function (opts) {
            const recordModel = opts.recordModel;
            const category = recordModel.get(opts.metadata.currentProp);
            const lgPalettes = new LGPalettes();
            const palette = lgPalettes.getPalette(opts.metadata.paletteId, 8, 'categorical');
            const symbol = Symbol.createCategoricalSymbol(
                category, opts.layerModel, this.maxId() + 1,
                this.length, palette
            );
            symbol.addModel(recordModel);
            this.add(symbol);
        }
    }, {
        buildCategoricalSymbolSet: function (categoryList, layerModel, palette) {
            const symbols = new Symbols();
            categoryList.forEach((category, index) => {
                symbols.add(Symbol.createCategoricalSymbol(category, layerModel, index, index, palette));
            });
            return symbols;
        }
    });
    return Symbols;
});
