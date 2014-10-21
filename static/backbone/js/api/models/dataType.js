define(["underscore", "models/base"], function (_, Base) {
    "use strict";
    var DataType = Base.extend({

        toString: function () {
            return this.get('name');
        }
    });
    return DataType;
});
