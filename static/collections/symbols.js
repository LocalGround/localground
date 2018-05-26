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
        UNCATEGORIZED_SYMBOL_RULE: '¯\\_(ツ)_/¯',
        initialize: function (recs, opts) {
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, recs, opts);
        },
        maxId: function() {
            let symbolIds = this.models.map(symbol => symbol.get('id'));
            //console.log(symbolIds)
            //console.log(...symbolIds)
            return Math.max(...this.models.map(symbol => symbol.get('id')))
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
