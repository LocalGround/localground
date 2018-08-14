
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
            'click .detach_media': 'relayDetachMedia',
            'click .fa-star-o': 'addStar',
            'click .fa-star': 'removeStar'
        },
        className: 'media-items_wrapper',

        templateHelpers: function () {
            return {
                photoVideoModels: this.collection.toJSON(),
                showHeader: this.collection.length > 0,
                featured_image: this.getFeaturedImage()
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
        },
        getFeaturedImage: function () {
            if (!this.recordModel) {
                return;
            }
            const extras = this.recordModel.get("extras") || {};
            return extras.featured_image;
        },
        removeStars: function () {
            this.$el.find(".hover-to-show.featured").removeClass("featured");
            this.$el.find("i.fa-star").removeClass("fa-star").addClass("fa-star-o");
        },
        addStar: function (e) {
            this.removeStars();
            var $elem = $(e.target),
                extras = this.recordModel.get("extras") || {};
            $elem.removeClass("fa-star-o").addClass("fa-star");
            $elem.parent().addClass("featured");
            extras.featured_image = parseInt($elem.attr("data-id"), 10);
            this.recordModel.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
            this.recordModel.set("extras", extras);
        },
        removeStar: function () {
            this.removeStars();
            var extras = this.recordModel.get("extras") || {};
            delete extras.featured_image;
            this.recordModel.save({extras: JSON.stringify(extras)}, {patch: true, parse: false});
            this.recordModel.set("extras", extras);
        }
    });
    return PhotoVideoViewer;
});
