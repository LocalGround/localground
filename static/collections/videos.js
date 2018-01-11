define(["models/video", "collections/basePageableWithProject"],
function (Video, BasePageableWithProject) {
    "use strict";
    /**
     * @class localground.collections.VideoFiles
     */
    var Videos = BasePageableWithProject.extend({
        model: Video,
        overlay_type: 'video',
        fillColor: "#92374D",
        size: 12,
        key: 'videos',
        name: 'Video Files',
        url: '/api/0/videos/'
    });
    return Videos;
});
