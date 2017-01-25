define(["models/layer", "collections/base"], function (Layer, Base) {
    "use strict";
    /**
     * @class localground.collections.Layers
     */
    var Layers = Base.extend({
        model: Layer,
        name: 'Layers',
        key: 'layers',
        initialize: function (recs, opts) {
            opts = opts || {};
            $.extend(this, opts);
            if (!this.mapID) {
                alert("The Records collection requires a map id upon initialization");
                return;
            }
            this.url = "/api/0/maps/" + this.mapID + "/layers";
            Base.prototype.initialize.apply(this, arguments);
        },
    });
    return Layers;
});
