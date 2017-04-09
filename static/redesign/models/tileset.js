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
        },
        getMapTypeID: function () {
            var sourceName = this.get("source_name").toLowerCase(),
                mapTypeID = this.get("name");
            if (sourceName === "google" && !this.isCustom()) {
                mapTypeID = mapTypeID.toLowerCase();
            }
            return mapTypeID;
        }

    });
    return TileSet;
});
