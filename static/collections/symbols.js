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

        removeStaleMatches: function (record, matchSymbol) {
            this.each(symbol => {
                if (symbol.isRemovalCandidate(record) & symbol !== matchSymbol) {
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
        /*hasValue: function (record) {
            const prop = this.layerModel.get('metadata').currentProp
            const value = record.get(prop);
            if (value && value !== 0) {
                return true;
            }
            return false;
        },*/
        updateIfApplicable: function (record) {
            const prop = this.layerModel.get('metadata').currentProp
            const value = record.get(prop);
            let matchedSymbol;
            this.each(symbol => {
                if (symbol.isUpdateCandidate(record, value)
                    && this.getNumMatches(record) === 1) {
                    console.log('updateIfApplicable');
                    matchedSymbol = symbol;
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
                    console.log('assignToExistingSymbol');
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
                console.log('creating new individual symbol');
                matchedSymbol = Symbol.createIndividualSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.getNextColor()
                });
                matchedSymbol.addModel(record);
                this.add(matchedSymbol);

            } else if (this.layerModel.isCategorical() && value) {
                console.log('creating new categorical symbol');
                matchedSymbol = Symbol.createCategoricalSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.getNextColor()
                });
                matchedSymbol.addModel(record);
                if (this.getUncategorizedSymbol()) {
                    this.add(matchedSymbol, {at: this.length - 1});
                } else {
                    this.add(matchedSymbol);
                }

            } else {
                matchedSymbol = this.getUncategorizedSymbol();
                if (matchedSymbol) {
                    console.log('adding to existing uncategorized symbol');
                    matchedSymbol.addModel(record);
                } else {
                    console.log('adding to new uncategorized symbol');
                    matchedSymbol = Symbol.createUncategorizedSymbol({
                        layerModel: this.layerModel,
                        id: this.getNextId()
                    })
                    matchedSymbol.addModel(record);
                    this.add(matchedSymbol);
                }
            }
            return matchedSymbol;
        },
        getUncategorizedSymbol: function () {
            return this.findWhere({
                rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
            })
        },
        assignRecords: function (records) {
            records.each(record => {
                this.assignRecord(record);
            });
            this.removeEmpty();
        },
        assignRecord: function (record) {
            // add to symbol in the following order:
            //   a) append to existing symbol
            //   b) else create new symbol
            return (
                this.assignToExistingSymbol(record) ||
                this.assignToNewSymbol(record)
            );
        },
        reassignRecord: function (record) {
            // 1. try and update if applicable:
            let symbol = this.updateIfApplicable(record);
            if (symbol) {
                return symbol;
            }

            // 2. else assign record to new or existing symbol:
            symbol = this.assignRecord(record);

            // 3. remove stale matches:
            this.removeStaleMatches(record, symbol);
            this.removeEmpty();

            // 4. return matched symbol:
            return symbol;
        },
    }, {
        buildCategoricalSymbolSet: function (categoryList, layerModel) {
            const symbols = new Symbols(null, {layerModel: layerModel});
            const palette = symbols.getPalette();
            categoryList.forEach((value, index) => {
                symbols.add(Symbol.createCategoricalSymbol({
                    layerModel: layerModel,
                    category: value,
                    id: (index + 1),
                    fillColor: '#' + palette[index % palette.length]
                }));
            });
            return symbols;
        }
    });
    return Symbols;
});
