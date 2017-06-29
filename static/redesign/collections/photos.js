define(["models/photo", "collections/base", "collections/basePageable"], function (Photo, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Photos = BasePageable.extend({
        model: Photo,
        fillColor: "#7084c2",
        size: 12,
        name: 'Photos',
        key: 'photos',
        url: '/api/0/photos/'
    });
    return Photos;
});
