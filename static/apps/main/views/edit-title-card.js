
define([
    "underscore",
    "handlebars",
    "marionette",
    "views/add-media",
    "lib/media/photo-video-viewer",
    "lib/media/audio-viewer",
    "text!../templates/edit-title-card.html"
], function (_, Handlebars, Marionette, AddMedia, PhotoVideoView, AudioView, EditTitleCardTemplate) {
    "use strict";
    var EditTitleCard = Marionette.ItemView.extend({
        template: Handlebars.compile(EditTitleCardTemplate),
        initialize: function (opts) {
            // Note: the model for this view is the *TitleCard* model
            // (a convenience model that does not correspond w/endpoint):
            _.extend(this, opts);
            this.secondaryModal = this.app.secondaryModal;
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

        attachMedia: function (models) {
            models.forEach(model => {
                this.model.addMediaModel(model);
            });
            this.activeMap.save(null, {
                success: () => {
                    this.secondaryModal.hide();
                    this.render();
                }
            });
        },

        detachMedia: function(e) {
            const $target = $(e.target);
            const id = parseInt($target.attr('data-id'));
            const overlay_type = $target.attr('data-type');
            this.model.removeMediaModel(id, overlay_type);
            this.activeMap.save(null, {
                success: () => {
                    this.render();
                }
            });
        }
    });
    return EditTitleCard;
});
