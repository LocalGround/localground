
define([
    "underscore",
    "handlebars",
    "marionette",
    "views/add-media",
    "lib/modals/modal",
    "text!../templates/edit-title-card.html"
], function (_, Handlebars, Marionette, AddMedia, Modal, EditTitleCardTemplate) {
    "use strict";
    var EditTitleCard = Marionette.ItemView.extend({
        template: Handlebars.compile(EditTitleCardTemplate),
        initialize: function (opts) {
            opts.model = opts.activeMap;
            _.extend(this, opts);
            this.modal = this.app.modal;
            this.secondaryModal = new Modal({
                app: this.app
            });
            this.popover = this.app.popover;
        },
        events: {
            'click .photo-icon_wrapper': 'showMediaBrowser'
        },
        modelEvents: {
            'add-media-to-model': 'attachMedia'
        },

        className: 'edit-title-card-menu',

        templateHelpers: function () {
            let header, description;

            // once map metadata is fully implemented, these conditional statements can be removed
            if (this.activeMap.get('metadata')) {
                if (this.activeMap.get('metadata').titleCardInfo) {
                    header = this.activeMap.get('metadata').titleCardInfo.header;
                    description = this.activeMap.get('metadata').titleCardInfo.description;
                }
            }
            return {
                header: header,
                description: description
            };
        },

        saveTitleCard: function() {
            let header = this.$el.find('.title-card_title').val();
            let description = this.$el.find('.title-card_textarea').val();


            this.activeMap.get('metadata').titleCardInfo.header = header;
            this.activeMap.get('metadata').titleCardInfo.description = description;

            this.activeMap.save(null, {
                    success: () => {
                        this.app.vent.trigger('close-modal');
                    }
                }
            );
        },
        showMediaBrowser: function (e) {
            console.log('show media browser');
            var uploadAttachMedia = new AddMedia({
                app: this.app,
                parentModel: this.model
            });
            this.secondaryModal.update({
                title: 'Media Browser',
                //width: 1100,
                //height: 400,
                view: uploadAttachMedia,
                saveButtonText: "Add",
                showDeleteButton: false,
                showSaveButton: true,
                saveFunction: uploadAttachMedia.addModels.bind(uploadAttachMedia),
            });
            this.secondaryModal.show();
            uploadAttachMedia.showUploader();
            e.preventDefault();
        },
        attachMedia: function (models) {
            console.log('do something with these models:', models);
            alert(models);
        }
    });
    return EditTitleCard;
});
