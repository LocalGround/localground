define(["models/base"], function (Base) {
    "use strict";
    var Map = Base.extend({
        getNamePlural: function () {
            return "maps";
        },
      //  urlRoot: "/api/0/maps/",
        defaults: function () {
            return _.extend({}, Base.prototype.defaults, {
                checked: false,
                panel_styles: {
                    title: {type: "title", font: "Lato", fw: "bold", color: "33ff52", size: "15"},
                    subtitle: {type: "subtitle", font: "Lato", fw: "regular", color: "gray", size: "12"},
                    paragraph: {type: "paragraph", font: "Lato", fw: "regular", color: "black", size: "12"},
                    tags: {type: "tags", font: "Lato", fw: "regular", color: "black", size: "10"}
                }
            });
        }
    });
    return Map;
});
