
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
            // Note: the model for this view is the TitleCard model
            // (a convenience model, like the Symbol model):
            _.extend(this, opts);
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
                header: this.model.get('header'),
                description: this.model.get('description')
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
                model: this.model
            });
            this.$el.find('.title-card_media').append(this.photoVideoView.$el);
        },

        attachAudioView: function (media) {
            this.audioView = new AudioView({
                detachMedia: this.detachMedia.bind(this),
                app: this.app,
                audioCollection: this.model.getAudioCollection(this.app.dataManager)
            });
            this.$el.find('.title-card_media').append(this.audioView.$el);
        },

        saveTitleCard: function () {
            this.model.set('header', this.$el.find('.title-card_title').val());
            this.model.set('description',this.$el.find('.title-card_textarea').val());
            console.log(this.model.toJSON);
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

        mediaItemAlreadyInList: function (mediaList, newItem) {
            let flag = false;
            mediaList.forEach(existingItem => {
                if (existingItem.id === newItem.id && existingItem.type === newItem.type){
                    flag = true;
                    return;
                }
            });
            return flag
        },

        assignDataType: function (model) {
            if (model.get('overlay_type') === 'audio') {
                return 'audio';
            }
            return model.get('overlay_type') + 's';
        },

        attachMedia: function (models) {
            const mediaList = this.model.getMedia();
            models.forEach((model)=> {
                const newMediaItem = {
                    id: model.id,
                    type: this.assignDataType(model)
                };

                // need to make sure media object being added to title card isn't already attached to the title card.
                if (!this.mediaItemAlreadyInList(mediaList, newMediaItem)) {
                    if (newMediaItem.type === 'videos') {
                        newMediaItem.video_provider = model.get('video_provider');
                    }
                    mediaList.push(newMediaItem);
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
            const newList = this.model.getMedia().filter(item => {
                return !(item.id === idToBeRemoved && item.type === dataType);
            });
            this.model.setMedia(newList);
            this.activeMap.save(null, {
                success: () => {
                    this.render();
                }
            });
        }
    });
    return EditTitleCard;
});
