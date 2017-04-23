define(["models/tileset", "collections/base"], function (TileSet, Base) {
    "use strict";
    var TileSets = Base.extend({
        model: TileSet,
        name: 'Tilesets',
        key: 'tilesets',
        url: '/api/0/tiles/'
    });
    return TileSets;
});
