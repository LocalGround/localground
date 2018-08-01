
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
            console.log(this);

            this.render();
        },
        events: {
            //'click .photo-icon_wrapper': 'showMediaBrowser',
            //'click .detach_media': 'detachMedia'
        },

        className: 'media-items_wrapper',

        templateHelpers: function () {
            let photos = []; 
            let videos = [];
            this.photoCollection.each((item) => {
                photos.push({
                    id: item.get('id'),
                    path: item.get('path')
                });
            });

            this.videoCollection.each((item) => {
                videos.push({
                    id: item.get('id'),
                    video_id: item.get('video_id'),
                    video_provider: item.get('video_provider')
                });
            });
           
            return {
                photos,
                videos
            };
        },

        detachMediaItem: function(e) {
            this.detachMedia(e);
        }
        
            
    });
    return PhotoVideoViewer;
});
