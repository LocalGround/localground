define(["models/base"],
    function (Base) {
        "use strict";
        var Icon = Base.extend({
            schema: {
                name: { type: 'TextArea', title: "Name" }
            }
        });
        return Icon;
    });
