define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the MapImage datatype.
     * @class MapImage
     * @see <a href="//localground.org/api/0/map-images/">//localground.org/api/0/map-images/</a>
     */
    var MapImage = Base.extend({
        schema: {
            name: { type: 'TextArea', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'TextArea', title: "Attribution" },
            tags: { type: 'List', itemType: 'Text' }
        },
        hiddenFields: [
            "geometry",
            "overlay_type",
            "project_id",
            "url",
			"source_print",
            "status"
        ],
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })
    });
    return MapImage;
});
