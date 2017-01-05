define(["models/map", "collections/basePageable"], function (Map, BasePageable) {
    "use strict";
    var Maps = BasePageable.extend({
        model: Map,
        name: 'Maps',
        key: 'maps',
        url: '/api/0/maps/'
    });
    return Maps;
});
