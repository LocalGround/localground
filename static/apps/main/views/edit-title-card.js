
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

            let media = {
                photos: [],
                videos: [],
                audio: []
            };
            this.activeMap.get('metadata').titleCardInfo.media.forEach((item) => {
                let mediaObj = this.app.dataManager.getMediaItem(item.id, item.type);
                console.log(item.id, item);
                if (mediaObj) {
                    if (item.type === 'photos') {
                        media.photos.push({
                            path: mediaObj.get('path_medium'),
                            id: item.id
                        });
                    } else if (item.type === 'videos') {
                        media.videos.push({
                            id: item.id,
                            video_id: mediaObj.get('video_id'),
                            video_provider: mediaObj.get('video_provider')
                        });
                    } else if (item.type === 'audio') {
                        media.audio.push({
                            id: item.id,
                            name: mediaObj.get('name')
                        });
                    }
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
            console.log(models);
            let list = this.activeMap.get('metadata').titleCardInfo.media; // pointer
            models.forEach((model)=> {
                // if (!list.includes(model.id)) {
                //     list.push({
                //         id: model.id,
                //         type: model.dataType
                //     });
                // }

                // need to make sure media ibject being added to title card isn't already attached to the title card.

                let dataType;
                if (model.get('overlay_type') === 'photo') {
                    dataType = 'photos';
                } else if (model.get('overlay_type') === 'video') {
                    dataType = 'videos';
                } else if (model.get('overlay_type') === 'audio') {
                    dataType = 'audio';
                }

                let newMediaItem = {
                    id: model.id,
                    type: dataType
                };

                if (newMediaItem.type === 'videos') {
                    newMediaItem.video_provider = model.get('video_provider');
                }

                list.push(newMediaItem);
            });

            console.log(list);
            console.log(this.activeMap.get('metadata').titleCardInfo.media);
            console.log(this.activeMap);

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

            console.log(dataType);
            const originalList = this.activeMap.get('metadata').titleCardInfo.media;
            const newList = originalList.filter((item) => {
                if (item.id === idToBeRemoved && item.type === dataType) {
                    return false;
                }
                return true;
            });

            console.log(originalList, newList);
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
