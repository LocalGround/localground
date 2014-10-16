define(["models/mapimage", "collections/base"], function (MapImage, Base) {
    "use strict";
    /**
     * @class localground.collections.MapImages
     */
    var MapImages = Base.extend({
        model: MapImage,
        name: 'Map Images',
        url: '/api/0/map-images/',
        parse: function (response) {
            return response.results;
        }
    });
    return MapImages;
});
