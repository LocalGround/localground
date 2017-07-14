define(["models/video", "collections/basePageable"], function (Video, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var Videos = BasePageable.extend({
        model: Video,
        overlay_type: 'video',
        fillColor: "hotpink",
        size: 12,
        key: 'video',
        name: 'Video Files',
        url: '/api/0/videos/'
    });
    return Videos;
});
