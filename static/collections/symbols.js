define(["underscore", "models/symbol", "collections/base"],
    function (_, Symbol, Base) {
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
                throw Error('A layerModel must be defined.')
            }
            Base.prototype.initialize.apply(this, recs, opts);
        },
        getNextId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            if (symbolIds.length === 0) {
                return 1;
            }
            return Math.max(...this.models.map(symbol => symbol.get('id'))) + 1
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

        __removeStaleMatches: function (record, matchSymbol) {
            this.each(symbol => {
                if (symbol.isRemovalCandidate(record) && symbol !== matchSymbol) {
                    symbol.removeModel(record);
                }
            });
        },
        __getNumMatches: function (record) {
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
        __updateIfApplicable: function (record) {
            const prop = this.layerModel.get('metadata').currentProp
            const value = record.get(prop);
            let matchedSymbol;
            this.each(symbol => {
                if (symbol.isUpdateCandidate(record, value)
                    && this.__getNumMatches(record) === 1) {
                    console.log('__updateIfApplicable');
                    matchedSymbol = symbol;
                    symbol.set({
                        'rule': `${prop} = '${value}'`,
                        'title': value
                    });
                }
            });
            return matchedSymbol;
        },
        __assignToExistingSymbol: function (record) {
            let matchedSymbol;
            this.each(symbol => {
                if (symbol.checkModel(record)) {
                    console.log('__assignToExistingSymbol');
                    matchedSymbol = symbol;
                    matchedSymbol.addModel(record);
                }
            })
            return matchedSymbol;
        },
        __assignToNewSymbol: function (record) {
            // Note: new continuous symbols don't get created, and instead
            //       get binned into uncategorized.
            //       new categorical and 'individual' symbols do ge created
            let matchedSymbol;
            const metadata = this.layerModel.get('metadata');
            const value = record.get(metadata.currentProp);

            if (this.layerModel.isIndividual()){
                console.log('creating new individual symbol');
                matchedSymbol = Symbol.createIndividualSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.layerModel.getNextColor()
                });
                matchedSymbol.addModel(record);
                this.add(matchedSymbol);

            } else if (this.layerModel.isCategorical() && value) {
                console.log('creating new categorical symbol');
                matchedSymbol = Symbol.createCategoricalSymbol({
                    layerModel: this.layerModel,
                    category: value,
                    id: this.getNextId(),
                    fillColor: this.layerModel.getNextColor()
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
        getUniformSymbol: function () {
            return this.findWhere({
                rule: Symbol.UNIFORM_SYMBOL_RULE
            })
        },
        hasUniformSymbol: function () {
            return this.getUniformSymbol()
        },
        getUncategorizedSymbol: function () {
            return this.findWhere({
                rule: Symbol.UNCATEGORIZED_SYMBOL_RULE
            })
        },
        hasUncategorizedSymbol: function () {
            return this.getUncategorizedSymbol()
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
                this.__assignToExistingSymbol(record) ||
                this.__assignToNewSymbol(record)
            );
        },
        reassignRecord: function (record) {
            // 1. try and update if applicable:
            let symbol = this.__updateIfApplicable(record);
            if (symbol) {
                return symbol;
            }

            // 2. else assign record to new or existing symbol:
            symbol = this.assignRecord(record);

            // 3. remove stale matches:
            this.__removeStaleMatches(record, symbol);
            this.removeEmpty();

            // 4. return matched symbol:
            return symbol;
        },
        toSVGList: function () {
            return this.map(item => item.toSVG())
        }
    }, {
        buildCategoricalSymbolSet: function (categoryList, layerModel) {
            const symbols = new Symbols(null, {layerModel: layerModel});
            const palette = layerModel.getPalette();
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
