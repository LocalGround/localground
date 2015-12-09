define(["models/base", "underscore"], function (Base, _) {
    "use strict";
    /**
     * A Backbone Model class for the Audio datatype.
     * @class Audio
     * @see <a href="//localground.org/api/0/audio/">//localground.org/api/0/audio/</a>
     */
    var Audio = Base.extend({
        getExtension: function () {
            return _.last(this.get('file_name').split('.'));
        }
    });
    return Audio;
});
