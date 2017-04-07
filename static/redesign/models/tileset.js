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
        }

    });
    return TileSet;
});
