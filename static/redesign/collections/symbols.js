define(["models/symbol", "collections/base"], function (Symbol, Base) {
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
            Base.prototype.initialize.apply(this, arguments);
        }
    });
    return Symbols;
});
