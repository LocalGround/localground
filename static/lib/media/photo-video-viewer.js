
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "text!./photo-video-viewer.html"
], function (_, Handlebars, Marionette, Modal, PhotoVideoTemplate) {
    "use strict";
    var PhotoVideoViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(PhotoVideoTemplate),
        initialize: function (opts) {
            //opts.model = opts.activeMap;
            _.extend(this, opts);
            this.modal = this.app.modal;
            // this.secondaryModal = new Modal({
            //     app: this.app
            // });
            this.popover = this.app.popover;

            this.render();
        },
        events: {
            'click .detach_media': 'relayDetachMedia'
        },

        className: 'media-items_wrapper',

        templateHelpers: function () {
            let photos = []; 
            let videos = [];
            this.photoCollection.each((model) => {
                photos.push({
                    id: model.get('id'),
                    path: model.get('path')
                });
            });

            this.videoCollection.each((model) => {
                videos.push({
                    id: model.get('id'),
                    video_id: model.get('video_id'),
                    video_provider: model.get('video_provider')
                });
            });
           
            return {
                photos: photos,
                videos: videos, 
                showHeader: (this.photoCollection.length > 0) || (this.videoCollection.length > 0)
            };
        },

        relayDetachMedia: function(e) {
            this.detachMedia(e);
        } 
    });
    return PhotoVideoViewer;
});
