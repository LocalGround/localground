define(["models/icon", "collections/basePageable"], function (Icon, BasePageable) {
    "use strict";
    /**
     * @class localground.collections.AudioFiles
     */
    var Icons = BasePageable.extend({
        model: Icon,
        overlay_type: 'icon',
        fillColor: "#62929E",
        size: 12,
        key: 'icons',
        name: 'Icons',
        url: '/api/0/icons/'
    });
    return Icons;
});
