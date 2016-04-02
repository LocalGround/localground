define(["models/mapimage", "collections/base", "collections/basePageable"], function (MapImage, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.MapImages
     */
    var MapImages = BasePageable.extend({
        model: MapImage,
        name: 'Map Images',
        key: 'map-images',
        url: '/api/0/map-images/',
        parse: function (response) {
            return response.results;
        }
    });
    return MapImages;
});
