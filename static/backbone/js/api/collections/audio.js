define(["backbone", "models/audio", "collections/base"], function (Backbone, Audio, Base) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var AudioFiles = Base.extend({
        model: Audio,
        name: 'Audio Files',
        url: '/api/0/audio/',
        parse: function (response) {
            return response.results;
        }
    });
    return AudioFiles;
});
