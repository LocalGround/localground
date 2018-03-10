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
        initialize: function (recs, opts) {
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, recs, opts);
        }
    });
    return Symbols;
});
