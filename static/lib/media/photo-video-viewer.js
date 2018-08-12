
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
            this.photoVideoModels = this.model.getPhotoVideoCollection(this.app.dataManager);
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
        },
        onRender: function () {
            this.enableMediaReordering();
        },
        enableMediaReordering: function () {
            var that = this,
                newOrder,
                attachmentType,
                attachmentID,
                association;
            this.$el.sortable({
                helper: this.fixHelper,
                items : '.attached-container',
                update: (event, ui) => {
                    newOrder = ui.item.index();
                    //attachmentType = ui.item.find('.detach_media').attr("data-type");
                    //attachmentID = ui.item.find('.detach_media').attr("data-id");
                    alert(newOrder);
                    // association = new Association({
                    //     model: that.model,
                    //     attachmentType: attachmentType,
                    //     attachmentID: attachmentID
                    // });
                    // association.save({ ordering: newOrder}, {patch: true});
                }
            }).disableSelection();
        }
    });
    return PhotoVideoViewer;
});
