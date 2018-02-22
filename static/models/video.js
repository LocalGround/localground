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
        initialize: function (data, opts) {
            Base.prototype.initialize.call(this);
            console.log(this.toJSON());
            this.projectID = this.projectID || this.get('project_id');
            if (!this.projectID ) {
                console.error("projectID is required");
                alert("projectID is required");
                return;
            }
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
