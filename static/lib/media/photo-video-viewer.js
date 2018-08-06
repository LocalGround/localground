
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
            _.extend(this, opts);
            this.photoVideoModels = this.model.getPhotoVideoModels(this.app.dataManager);
            this.render();
        },
        events: {
            'click .detach_media': 'relayDetachMedia'
        },
        className: 'media-items_wrapper',

        templateHelpers: function () {
            return {
                photoVideoModels: this.photoVideoModels.toJSON(),
                showHeader: this.photoVideoModels.length > 0
            };
        },
        relayDetachMedia: function(e) {
            this.detachMedia(e);
        }
    });
    return PhotoVideoViewer;
});
