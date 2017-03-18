define(["backbone", "models/audio", "collections/base", "collections/basePageable"], function (Backbone, Audio, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var AudioFiles = BasePageable.extend({
        model: Audio,
        key: 'audio',
        name: 'Audio Files',
        url: '/api/0/audio/',
        // parse: function (response) {
        //     return response.results;
        // }
    });
    return AudioFiles;
});
