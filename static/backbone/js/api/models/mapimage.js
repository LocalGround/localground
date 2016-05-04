define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the MapImage datatype.
     * @class MapImage
     * @see <a href="//localground.org/api/0/map-images/">//localground.org/api/0/map-images/</a>
     */
    var MapImage = Base.extend({
        hiddenFields: [
            "geometry",
            "overlay_type",
            "project_id",
            "url",
			"source_print",
            "status"
        ],
        getNamePlural: function () {
            return "map images";
        }
    });
    return MapImage;
});
