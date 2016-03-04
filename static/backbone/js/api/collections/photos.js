define(["models/photo", "collections/base"], function (Photo, Base) {
    "use strict";
    /**
     * @class localground.collections.Photos
     */
    var Photos = Base.extend({
        model: Photo,
        name: 'Photos',
        url: '/api/0/photos/',
        modifyUrl: function(parameters){
          this.url = '/api/0/photos/';
          this.url += this.createServerQuery(parameters);
        }
    });
    return Photos;
});
