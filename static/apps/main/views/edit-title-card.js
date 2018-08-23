
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
            'click #add-media': 'showMediaBrowser'
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
                app: this.app,
                collection: this.model.getPhotoVideoCollection(this.app.dataManager),
                detachMediaFunction: this.detachMedia.bind(this),
                updateOrdering: this.updateMediaOrdering.bind(this)
            });
            this.$el.find('.title-card_media').append(this.photoVideoView.$el);
        },

        attachAudioView: function () {
            this.audioView = new AudioView({
                app: this.app,
                collection: this.model.getAudioCollection(this.app.dataManager),
                detachMediaFunction: this.detachMedia.bind(this),
                updateOrdering: this.updateMediaOrdering.bind(this)
            });
            this.$el.find('.title-card_media').append(this.audioView.$el);
        },

        updateMediaOrdering: function (id, overlay_type, newOrder) {
            this.model.updateMediaOrdering(id, overlay_type, newOrder);
            this.activeMap.save();
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
                saveFunction: uploadAttachMedia.addModels.bind(uploadAttachMedia)
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

        detachMedia: function (attachmentType, attachmentID) {
            this.model.removeMediaModel(attachmentType, attachmentID);
            this.activeMap.save(null, {
                success: () => {
                    this.render();
                }
            });
        }
    });
    return EditTitleCard;
});
