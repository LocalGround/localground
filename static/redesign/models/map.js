define(["models/base"], function (Base) {
    "use strict";
    var Map = Base.extend({
        getNamePlural: function () {
            return "maps";
        },
        defaults: _.extend({}, Base.prototype.defaults, {
            checked: false,
            panel_styles: JSON.parse(JSON.stringify(
                [
                {type: "title", font: "Lato", fw: "bold", color: "black", size: "15"},
                {type: "subtitle", font: "Lato", fw: "regular", color: "gray", size: "12"},
                {type: "paragraph", font: "Lato", fw: "regular", color: "black", size: "12"},
                {type: "tags", font: "Lato", fw: "regular", color: "black", size: "10"},    
                ]
            ))
        })
    });
    return Map;
});
