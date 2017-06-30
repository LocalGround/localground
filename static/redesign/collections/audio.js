define(["backbone", "models/audio", "collections/base", "collections/basePageable"], function (Backbone, Audio, Base, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var AudioFiles = BasePageable.extend({
        model: Audio,
        overlay_type: 'audio',
        fillColor: "#62929E",
        size: 12,
        key: 'audio',
        name: 'Audio Files',
        url: '/api/0/audio/'
    });
    return AudioFiles;
});
