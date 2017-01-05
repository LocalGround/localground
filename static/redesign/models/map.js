define(["models/base"], function (Base) {
    "use strict";
    var Map = Base.extend({
        getNamePlural: function () {
            return "maps";
        },
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false
        })
    });
    return Map;
});
