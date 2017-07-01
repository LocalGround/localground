define(["models/mapimage", "collections/base", "collections/basePageable"], function (MapImage, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.MapImages
     */
    var MapImages = BasePageable.extend({
        model: MapImage,
        overlay_type: 'map_image',
        name: 'Map Images',
        key: 'map_images',
        url: '/api/0/map-images/',
        // parse: function (response) {
        //     return response.results;
        // }
    });
    return MapImages;
});
