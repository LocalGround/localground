define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Layer
     * @see <a href="http://localground.org/api/0/layers/">http://localground.org/api/0/layers/</a>
     * Attributes: id, name, description, overlay_type, tags, owner, slug, access, symbols
     */
    var Layer = Base.extend({
		defaults: _.extend({}, Base.prototype.defaults, {
            isVisible: false
        }),
        urlRoot: "/api/0/layers/",
        getNamePlural: function () {
            return "layers";
        },
		validate: function (attrs) {
            //makes sure that symbols is either null or an array:
            if (attrs.hasOwnProperty('symbols') && (!_.isArray(attrs.symbols) && !_.isNull(attrs.symbols))) {
                return 'Layer.symbols must be a JSON array';
            }
            //if valid, returns null;
            return null;
		}
    });
    return Layer;
});
