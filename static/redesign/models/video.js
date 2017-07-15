define(["models/base"], function (Base) {
    "use strict";
    /**
     * A Backbone Model class for the Audio datatype.
     * @class Audio
     * @see <a href="//localground.org/api/0/audio/">//localground.org/api/0/audio/</a>
     */
    var Video = Base.extend({
        schema: {
            name: { type: 'Text', title: "Name" },
            caption:  { type: 'TextArea', title: "Caption" },
            attribution: { type: 'Text', title: "Attribution" },
            video_id: {type: 'Text', validators: ['required'] },
            video_provider: {
                type: 'Select',
                validators: ['required'],
                options: {
                    '': '--Select Provider--',
                    vimeo: 'Vimeo',
                    youtube: 'YouTube'
                }
            },
            tags: { type: 'List', itemType: 'Text' }
        },
        getFormSchema: function () {
            return this.schema;
        }
    });
    return Video;
});
