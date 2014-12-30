define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="http://localground.org/api/0/legends/">http://localground.org/api/0/legends/</a>
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            //isActive: false,
            isVisible: false
        }),
        urlRoot: "/api/0/legends/",
        getNamePlural: function () {
            return "layers";
        }
    });
    return Layer;
});
