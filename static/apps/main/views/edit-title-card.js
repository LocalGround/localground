
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
            'click .photo-icon_wrapper': 'showMediaBrowser',
            'click .detach_media': 'detachMedia'
        },
        modelEvents: {
            'add-media-to-model': 'attachMedia'
        },

        className: 'edit-title-card-menu',

        templateHelpers: function () {
            let header, description;

            let media = [];
            this.activeMap.get('metadata').titleCardInfo.photo_ids.forEach((photoId) => {
                let photo = this.app.dataManager.getPhoto(photoId);
                if (photo) {
                    media.push({
                        path: photo.get('path_medium'),
                        id: photo.id
                    });
                }
            });

            console.log(media);

            // once map metadata is fully implemented, these conditional statements can be removed
            if (this.activeMap.get('metadata')) {
                if (this.activeMap.get('metadata').titleCardInfo) {
                    header = this.activeMap.get('metadata').titleCardInfo.header;
                    description = this.activeMap.get('metadata').titleCardInfo.description;
                }
            }
            return {
                header: header,
                description: description,
                media: media
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
            let list = this.activeMap.get('metadata').titleCardInfo.photo_ids; // pointer
            models.forEach((model)=> {
                if (!list.includes(model.id)) {
                    list.push(model.id)
                }
            });

            this.activeMap.save(null, {
                success: () => {
                    this.secondaryModal.hide();
                    this.render();
                }
            });
        },

        detachMedia: function(e) {
            const idToBeRemoved = parseInt(e.target.dataset.id);
            const mediaList = this.activeMap.get('metadata').titleCardInfo.photo_ids.filter((item) => {
                return item !== idToBeRemoved;
            });

            this.activeMap.get('metadata').titleCardInfo.photo_ids = mediaList;

            this.activeMap.save(null, {
                success: () => {
                    this.render();
                }
            });
        }
    });
    return EditTitleCard;
});
