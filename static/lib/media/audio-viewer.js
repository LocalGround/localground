
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "text!./audio-viewer.html"
], function (_, Handlebars, Marionette, Modal, AudioViewerTemplate) {
    "use strict";
    var AudioViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(AudioViewerTemplate),
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
            'click .detach_media': 'relayDetachMedia'
        },

        className: 'media-items_wrapper',

        templateHelpers: function () {
            let audio = []; 

            this.audioCollection.each((model) => {
                audio.push({
                    id: model.get('id'),
                    videoname_id: model.get('name')
                });
            });
           
            return {
                audio: audio
            };
        },

        relayDetachMedia: function(e) {
            this.detachMedia(e);
        } 
    });
    return AudioViewer;
});
