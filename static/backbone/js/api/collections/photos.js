define(["models/photo", "collections/base"], function (Photo, Base) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Photos = Base.extend({
        model: Photo,
        name: 'Photos',
        url: '/api/0/photos/'
    });
    return Photos;
});
