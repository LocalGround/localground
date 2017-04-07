define(["models/base"], function (Base) {
    "use strict";
    var TileSet = Base.extend({
        schema: {
            name: 'Text',
            caption: { type: 'TextArea'},
            tags: 'Text',
            attribution: 'Text'
        },
        getNamePlural: function () {
            return "tilesets";
        },
        getClientStyles: function () {
            return this.get("extras") ? this.get("extras").clientStyles : null;
        },
        isCustom: function () {
            return this.getClientStyles() !== null;
        }

    });
    return TileSet;
});
