
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
            this.render();
        },
        events: {
            'click .detach_media': 'relayDetachMedia'
        },
        className: 'media-items_wrapper',

        templateHelpers: function () {
            return {
                photoVideoModels: this.collection.toJSON(),
                showHeader: this.collection.length > 0
            };
        },
        relayDetachMedia: function(e) {
            this.detachMedia(e);
        },
        onRender: function () {
            this.enableMediaReordering();
        },
        enableMediaReordering: function () {
            if (this.updateOrdering) {
                this.$el.sortable({
                    helper: this.fixHelper,
                    items : '.attached-container',
                    update: (event, ui) => {
                        const $elem = ui.item.find('.detach_media');
                        const id = parseInt($elem.attr("data-id"));
                        const overlay_type = $elem.attr("data-type");
                        const newOrder = ui.item.index() - 1;
                        this.updateOrdering(id, overlay_type, newOrder);
                    }
                }).disableSelection();
            }
        }
    });
    return PhotoVideoViewer;
});
