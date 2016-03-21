define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the MapImage datatype.
     * @class MapImage
     * @see <a href="//localground.org/api/0/map-images/">//localground.org/api/0/map-images/</a>
     */
    var MapImage = Base.extend({
        getNamePlural: function () {
            return "map images";
        }
    });
    return MapImage;
});
