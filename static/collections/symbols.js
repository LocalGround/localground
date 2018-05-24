define(["underscore", "models/symbol", "collections/base"], function (_, Symbol, Base) {
    "use strict";
    /**
     * Note: There is no "Symbols" API Endpoint. This is just a convenience function
     *       for serializing layers
     */
    var Symbols = Base.extend({
        model: Symbol,
        name: 'Symbols',
        key: 'symbols',
        UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',
        initialize: function (recs, opts) {
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, recs, opts);
        },
        reset: function (models, options) {
            //add an uncategorized symbol:
            const uncategorizedSymbol = _.findWhere(models, {rule: this.UNCATEGORIZED_SYMBOL_RULE});
            if (!uncategorizedSymbol) {
                models.push(new Symbol({
                    rule: this.UNCATEGORIZED_SYMBOL_RULE,
                    title: 'Uncategorized'
                }).toJSON());
            }
            Base.prototype.reset.apply(this, arguments);
        },
        maxId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            console.log(symbolIds)
            console.log(...symbolIds)
            return Math.max(...this.models.map(symbol => symbol.get('id')))
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
