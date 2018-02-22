define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Video datatype.
     * @class Video
     * @see <a href="//localground.org/api/0/video/">//localground.org/api/0/video/</a>
     */
    var Video = Base.extend({
        schema: {
            name: { type: 'Text', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'Text', title: "Attribution" },
            video_link: { type: 'Text', title: "Video Link", validators: ['required'] },
            tags: { type: 'List', itemType: 'Text' }
        },
        getDataTypePlural: function() {
            return 'videos';
        },
        getFormSchema: function () {
            return this.schema;
        }
    });
    return Video;
});
