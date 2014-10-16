define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Photo datatype.
     * @class Photo
     * @see <a href="http://localground.org/api/0/photos/">http://localground.org/api/0/photos/</a>
     */
    var Photo = Base.extend({
        getNamePlural: function () {
            return "photos";
        },
        defaults: {
            name: "Untitled"
        }
    });
    return Photo;
});
