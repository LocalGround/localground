define(["models/baseItem"], function (BaseItem) {
    "use strict";
    /**
     * A Backbone Model class for the print datatype.
     * @class Print
     * @see <a href="//localground.org/api/0/prints/">//localground.org/api/0/prints/</a>
     */
    var Print = BaseItem.extend({

        url: '/api/0/prints/',
        defaults: _.extend({}, BaseItem.prototype.defaults, {
            checked: false
        }),
        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = BaseItem.prototype.toJSON.call(this),
                center;
            if (this.center != null) {
                center = {
                    "type": "Point",
                    "coordinates": [
                        this.center.lng(),
                        this.center.lat()
                    ]
                };
                json.center = JSON.stringify(center);
            }
            return json;
        }
    });
    return Print;
});
