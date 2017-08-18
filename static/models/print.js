define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the print datatype.
     * @class Print
     * @see <a href="//localground.org/api/0/prints/">//localground.org/api/0/prints/</a>
     */
    var Print = Base.extend({

        url: '/api/0/prints/',
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        }),
        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = Base.prototype.toJSON.call(this),
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
