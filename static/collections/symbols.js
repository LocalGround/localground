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
            this.lgPalettes = new LGPalettes();
            _.extend(this, opts);
            if (!this.layerModel) {
                throw Error('A layerModel must be defined.')
            }
            Base.prototype.initialize.apply(this, recs, opts);
        },
        getPalette: function () {
            const metadata = this.layerModel.get('metadata');
            if (this.layerModel.isCategorical()) {
                return this.lgPalettes.getPalette(metadata.paletteId, 8, 'categorical');
            } else if (this.layerModel.isContinuous()) {
                return this.lgPalettes.getPalette(metadata.paletteId, 8, 'continuous');
            }
            return;
        },
        getNextId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            return Math.max(...this.models.map(symbol => symbol.get('id'))) + 1
        },
        getNextColor: function () {
            if (this.layerModel.isUniform() || this.layerModel.isIndividual() || this.length === 0) {
                return this.layerModel.get('metadata').fillColor;
            }
            const palette = this.getPalette();
            for (let i = this.length - 1; i >= 0; i--) {
                const fillColor = this.at(i).get('fillColor').replace('#', '');
                const index = palette.indexOf(fillColor);
                if (index > -1) {
                    return '#' + palette[(index + 1) % 8];
                }
            }
            return palette[0];
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
                this.layerModel.set('group_by', 'uniform');
                this.set([
                    Symbol.createUniformSymbol(this.layerModel, this.getNextId())
                ]);
            }
        },

        removeStaleMatches: function (record) {
            this.each(symbol => {
                if (symbol.containsRecord(record) && !symbol.checkModel(record)) {
                    symbol.removeModel(record);
                }
            });
        },
        getNumMatches: function (record) {
            let count = 0;
            this.each(symbol => {
                count += (symbol.containsRecord(record) || symbol.checkModel(record) ? 1 : 0);
            });
            return count;
        },

        updateIfApplicable: function (record) {
            let matchedSymbol;

            this.each(symbol => {
                if (symbol.containsRecord(record) &&
                    !symbol.checkModel(record) &&
                    symbol.matchedModels.length === 1 &&
                    this.getNumMatches(record) === 1) {
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
                matchedSymbol = Symbol.createIndividualSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.getNextColor()
                });
            } else if (this.layerModel.isCategorical() && value)  {
                matchedSymbol = Symbol.createCategoricalSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.getNextColor()
                });
            } else {
                matchedSymbol = this.getOrCreateUncategorizedSymbol()
            }
            matchedSymbol.addModel(record);
            this.add(matchedSymbol);
            return matchedSymbol;
        },
        getOrCreateUncategorizedSymbol: function () {
            const existingSymbol = this.findWhere({
                rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
            });
            if (!existingSymbol) {
                return Symbol.createUncategorizedSymbol({
                    layerModel: this.layerModel,
                    id: this.getNextId()
                })
            }
            return existingSymbol;
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

            //if neither of those work, create a new symbol:
            matchedSymbol = matchedSymbol || this.assignToNewSymbol(record);
            this.removeStaleMatches(record);
            this.removeEmpty();
            return matchedSymbol;
        },
    }, {
        buildCategoricalSymbolSet: function (categoryList, layerModel, palette) {
            const symbols = new Symbols(null, {layerModel: layerModel});
            categoryList.forEach((value, index) => {
                symbols.add(Symbol.createCategoricalSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.getNextColor()
                }));
            });
            return symbols;
        }
    });
    return Symbols;
});
