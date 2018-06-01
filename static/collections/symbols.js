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
            if (!this.layerModel) {
                throw Exception('A layerModel must be defined.')
            }
            Base.prototype.initialize.apply(this, recs, opts);
        },
        maxId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            return Math.max(...this.models.map(symbol => symbol.get('id')))
        },
        removeEmpty: function() {
            if (!this.layerModel.isContinuous()) {
                this.each(symbol => {
                    if (!symbol.hasModels()) {
                        this.remove(symbol);
                    }
                });
            }
            if (this.layerModel.isEmpty()) {
                this.set('group_by', 'uniform');
                this.replaceSymbols(new Symbols([
                    Symbol.createUniformSymbol(this)
                ]), {layerModel: this.layerModel});
            }
        },

        removeStaleMatches: function (record) {
            this.each(symbol => {
                if (symbol.containsRecord(record) && !symbol.checkModel(record)) {
                    symbol.removeModel(record);
                }
            });
        },

        updateIfApplicable: function (record) {
            let matchedSymbol;
            let count = 0;
            this.each(symbol => {
                count += (symbol.containsRecord(record) || symbol.checkModel(record) ? 1 : 0);
            });
            this.each(symbol => {
                if (symbol.containsRecord(record) &&
                    !symbol.checkModel(record) &&
                    symbol.matchedModels.length === 1 &&
                    count === 1) {
                    matchedSymbol = symbol;
                    const prop = this.layerModel.get('metadata').currentProp
                    const value = record.get(prop);
                    symbol.set({
                        'rule': `${prop} = '${value}'`,
                        'title': value
                    });
                }
            });
            return matchedSymbol;
        },
        assignToExistingSymbol: function (record) {
            let matchedSymbol;
            this.each(symbol => {
                if (symbol.checkModel(record)) {
                    matchedSymbol = symbol;
                    matchedSymbol.addModel(record);
                }
            })
            return matchedSymbol;
        },
        assignToNewSymbol: function (record) {
            let matchedSymbol;
            const metadata = this.layerModel.get('metadata');
            const value = record.get(metadata.currentProp);
            if (this.layerModel.isIndividual()){
                matchedSymbol = Symbol.createIndividualSymbol(this.layerModel, value);
            } else if (this.layerModel.isCategorical() && value)  {
                matchedSymbol = Symbol.createCategoricalSymbol(
                    this.layerModel, value, this.layerModel.getSymbols().length + 1);
            } else {
                matchedSymbol = Symbol.createUncategorizedSymbol(this.layerModel)
            }
            matchedSymbol.addModel(record);
            this.add(matchedSymbol);
            return matchedSymbol;
        },
        assignRecords: function (records) {
            records.each(record => {
                this.assignRecord(record);
            });
            this.removeEmpty();
        },
        assignRecord: function (record) {
            let matchedSymbol = this.assignToExistingSymbol(record);
            return matchedSymbol || this.assignToNewSymbol(record);
        },
        reassignRecord: function (record) {
            //first try updating current symbol:
            let matchedSymbol = this.updateIfApplicable(record);
            if (matchedSymbol) {
                return matchedSymbol;
            }
            //then try assigning to existing symbol:
            matchedSymbol = this.assignToExistingSymbol(record);
            //if neither of those work:
            matchedSymbol = matchedSymbol || this.assignToNewSymbol(record);
            this.removeStaleMatches(record);
            this.removeEmpty();
            return matchedSymbol;
        },
    }, {
        buildCategoricalSymbolSet: function (categoryList, layerModel, palette) {
            const symbols = new Symbols(null, {layerModel: layerModel});
            categoryList.forEach((value, index) => {
                symbols.add(Symbol.createCategoricalSymbol(
                    layerModel, value, index
                ));
            });
            return symbols;
        }
    });
    return Symbols;
});
