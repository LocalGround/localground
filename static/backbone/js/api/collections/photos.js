define(["models/photo", "collections/base", "collections/basePageable"], function (Photo, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Photos = BasePageable.extend({
        model: Photo,
        name: 'Photos',
        url: '/api/0/photos/'
    });
    return Photos;
});
