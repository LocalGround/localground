define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Audio datatype.
     * @class Audio
     * @see <a href="http://localground.org/api/0/audio/">http://localground.org/api/0/audio/</a>
     */
    var Audio = Base.extend({
        defaults: {
            name: "Untitled"
        }
    });
    return Audio;
});
