define(["models/base"], function (Base) {
    "use strict";
    var DataType = Base.extend({
        defaults: {
            name: "Untitled"
        },
        toString: function () {
            return this.get('name');
        }
    });
    return DataType;
});
