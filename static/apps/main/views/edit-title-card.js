
define([
    "underscore",
    "handlebars",
    "marionette",
    "views/add-media",
    "lib/modals/modal",
    "lib/media/photo-video-viewer",
    "lib/media/audio-viewer",
    "text!../templates/edit-title-card.html"
], function (_, Handlebars, Marionette, AddMedia, Modal, PhotoVideoView, AudioView, EditTitleCardTemplate) {
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
            return {
                header: this.activeMap.get('metadata').titleCardInfo.header,
                description: this.activeMap.get('metadata').titleCardInfo.description
            };
        },

        onRender: function() {
            this.attachPhotoVideoView();
            this.attachAudioView();
        },

        attachPhotoVideoView: function () {
            this.photoVideoView = new PhotoVideoView({
                detachMedia: this.detachMedia.bind(this),
                app: this.app,
                model: this.activeMap.getTitleCardModel()
            });
            this.$el.find('.title-card_media').append(this.photoVideoView.$el);
        },

        attachAudioView: function (media) {
            const cardModel = this.activeMap.getTitleCardModel();
            this.audioView = new AudioView({
                detachMedia: this.detachMedia.bind(this),
                app: this.app,
                audioCollection: cardModel.getAudioCollection(this.app.dataManager)
            });
            this.$el.find('.title-card_media').append(this.audioView.$el);
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
            });
        },
        showMediaBrowser: function (e) {
            var uploadAttachMedia = new AddMedia({
                app: this.app,
                parentModel: this.model
            });
            this.secondaryModal.update({
                title: 'Media Browser',
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

        mediaItemAlreadyInList: function(list, newItem) {
            let flag = false;
            list.forEach((existingItem) => {
                if (existingItem.id === newItem.id && existingItem.type === newItem.type){
                    flag = true;
                }
            });
            return flag
        },

        assignDataType: function(model) {
            if (model.get('overlay_type') === 'photo') {
                return 'photos';
            } else if (model.get('overlay_type') === 'video') {
                return 'videos';
            } else if (model.get('overlay_type') === 'audio') {
                return 'audio';
            }
        },

        attachMedia: function (models) {
            let list = this.activeMap.get('metadata').titleCardInfo.media; // pointer

            models.forEach((model)=> {
                let newMediaItem = {
                    id: model.id,
                    type: this.assignDataType(model)
                };

                // need to make sure media object being added to title card isn't already attached to the title card.
                if (!this.mediaItemAlreadyInList(list, newMediaItem)) {

                    if (newMediaItem.type === 'videos') {
                        newMediaItem.video_provider = model.get('video_provider');
                    }
                    list.push(newMediaItem);
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
            const dataType = e.target.dataset.type;

            const originalList = this.activeMap.get('metadata').titleCardInfo.media;
            const newList = originalList.filter((item) => {
                if (item.id === idToBeRemoved && item.type === dataType) {
                    return false;
                }
                return true;
            });

            this.activeMap.get('metadata').titleCardInfo.media = newList;

            this.activeMap.save(null, {
                success: () => {
                    this.render();
                }
            });
        }
    });
    return EditTitleCard;
});
