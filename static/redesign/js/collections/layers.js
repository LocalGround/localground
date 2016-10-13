define(["models/layer", "collections/base"], function (Layer, Base) {
    "use strict";
    /**
     * @class localground.collections.Layers
     */
    var Layers = Base.extend({
        model: Layer,
        name: 'Layers',
        key: 'layers',
        url: '/api/0/layers/'
    });
    return Layers;
});
