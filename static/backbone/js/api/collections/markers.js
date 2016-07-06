define(["models/marker", "collections/base"], function (Marker, Base) {
    "use strict";
    /**
     * @class localground.collections.Markers
     */
    var Markers = Base.extend({
        model: Marker,
        name: 'Markers',
        key: 'markers',
        url: '/api/0/markers/',
        parse: function (response) {
            return response.results;
        }
    });
    return Markers;
});
