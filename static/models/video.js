define(["models/baseItem"], function (BaseItem) {
    "use strict";
    /**
     * A Backbone Model class for the Video datatype.
     * @class Video
     * @see <a href="//localground.org/api/0/video/">//localground.org/api/0/video/</a>
     */
    var Video = BaseItem.extend({
        urlRoot: '/api/0/videos/',
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
        },
        getEmbedLink: function () {
            if (this.get('video_provider') == 'vimeo') {
                return 'https://player.vimeo.com/video/' + this.get('video_id');
            } else {
                return 'https://www.youtube.com/embed/' + this.get('video_id') + '?ecver=1';
            }
        },
        getKey: function () {
            return 'videos';
        },
        toTemplateJSON: function () {
            const json = BaseItem.prototype.toTemplateJSON.apply(this, arguments);
            json.embedURL = this.getEmbedLink();
            console.log(json)
            return json;
        },
    });
    return Video;
});
