define(["backbone", "models/audio", "collections/base", "collections/basePageableWithProject"],
    function (Backbone, Audio, Base, BasePageableWithProject) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var AudioFiles = BasePageableWithProject.extend({
        model: Audio,
        overlay_type: 'audio',
        fillColor: "#62929E",
        size: 12,
        key: 'audio',
        name: 'Audio Files',
        url: '/api/0/audio/' // Maybe thinking about simply adding in that ?project_id={id}
    });
    return AudioFiles;
});
