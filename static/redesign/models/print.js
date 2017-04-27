define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the print datatype.
     * @class Print
     * @see <a href="//localground.org/api/0/prints/">//localground.org/api/0/prints/</a>
     */
    var Print = Base.extend({

        url: '/api/0/prints/',
        getNamePlural: function () {
            return "prints";
        },
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        }),
        toJSON: function () {
            // ensure that the geometry object is serialized before it
            // gets sent to the server:
            var json = Base.prototype.toJSON.call(this);

            if (json.center != null) {
                json.center = {
                    "type": "Point",
                    "coordinates": [
                        json.center.lng(),
                        json.center.lat()
                    ]
                }
                json.center = JSON.stringify(json.center);

            }
            return json;
        }
    });
    return Print;
});
