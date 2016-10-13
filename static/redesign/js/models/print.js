define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the print datatype.
     * @class Print
     * @see <a href="//localground.org/api/0/prints/">//localground.org/api/0/prints/</a>
     */
    var Print = Base.extend({
        getNamePlural: function () {
            return "prints";
        },
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })
    });
    return Print;
});
