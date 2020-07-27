define(["backbone"], function (Backbone) {
    "use strict";
    var TitleCard = Backbone.Model.extend({
        // this does not correspond w/API endpoint, but useful for organizing
        // functionality
        initialize: function (data, opts) {
            Backbone.Model.prototype.initialize.apply(this, arguments);
            //this.set('media', this.get('media') || []);
            this.photoVideoCollection = [];
            this.audioCollection = [];
		},

        getMedia: function () {
            return this.get('media');
        },

        addMediaModel: function (model) {
            if (model.get('overlay_type') === 'audio') {
                if (!this.audioCollection.get(model.id)) {
                    this.audioCollection.add(model);
                }
            } else {
                if (!this.photoVideoCollection.findWhere({
                        id: model.id,
                        overlay_type: model.get('overlay_type')
                    })) {
                    this.photoVideoCollection.add(model);
                }
            }
            //and add to the media array as well (to be saved to the server)
            this.get('media').push({ 
                id: model.id, 
                overlay_type: model.get('overlay_type')
            })
        },

        removeMediaModel: function(attachmentType, id) {
            if (attachmentType === 'audio') {
                this.audioCollection.remove(this.audioCollection.get(id));
            } else {
                const overlay_type = attachmentType.substring(0, attachmentType.length - 1);
                const modelToRemove = this.photoVideoCollection.findWhere({
                    id: id, overlay_type: overlay_type
                });
                this.photoVideoCollection.remove(modelToRemove);
            }
            this.set('media', this.getMediaJSON());
        },

        getPhotoVideoCollection: function (dataManager) {
            if (this.photoVideoCollection.length === 0) {
                this.photoVideoCollection = new Backbone.Collection(
                    this.getMedia().filter(item => (item.overlay_type !== 'audio'))
                        .map(item => dataManager.getCollection(item.overlay_type + 's').get(item.id))
                        .filter(item => (item != null))
                );
            }
            return this.photoVideoCollection;
        },

        getAudioCollection: function (dataManager) {
            if (this.audioCollection.length === 0) {
                this.audioCollection = new Backbone.Collection(
                    this.getMedia().filter(item => (item.overlay_type === 'audio'))
                        .map(item => dataManager.getAudio(item.id))
                        .filter(item => (item != null))
                );
            }
            return this.audioCollection;
        },

        updateMediaOrdering: function (id, overlay_type, newOrder) {
            const collection = (overlay_type === 'audio') ? this.audioCollection : this.photoVideoCollection;
            const model = collection.findWhere({id: id, overlay_type: overlay_type});
            collection.remove(model);
            collection.add(model, { at: newOrder })
        },

        moveToPosition: function (item, newOrder) {
            const likeMedia = this.getMedia().filter(
                element => (element.overlay_type === item.overlay_type)
            );
            //likeMedia.splice(to, 0, this.splice(from, 1)[0]);
        },

        getMediaJSON: function () {
            //serialize concatenated lists:
            const mediaJSON = this.photoVideoCollection.map(item => {
                return { id: item.id, overlay_type: item.get('overlay_type') }
            }).concat(this.audioCollection.map(item => {
                return { id: item.id, overlay_type: item.get('overlay_type') }
            }));
            return mediaJSON;
        },

        toJSON: function () {
            return {
                id: this.get('id'),
                description: this.get('description'),
                header: this.get('header'),
                // media: this.getMediaJSON(),
                media: this.get('media')
            };
        }
    });
    return TitleCard;
});
