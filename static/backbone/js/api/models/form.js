define(["models/base"], function (Base) {
    "use strict";
    var Form = Base.extend({
        defaults: {
            name: "Untitled"
        }
    });
    return Form;
});
