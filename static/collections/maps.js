define(["models/map", "collections/basePageableWithProject"],
function (Map, BasePageableWithProject) {
    "use strict";
    var Maps = BasePageableWithProject.extend({
        model: Map,
        name: 'Maps',
        key: 'maps',
        url: '/api/0/maps/'
    });
    return Maps;
});
