define(["backbone"], function (Backbone) {
    "use strict";
    var TitleCard = Backbone.Model.extend({
        // this does not correspond w/API endpoint, but useful for organizing
        // functionality
        initialize: function (data, opts) {
            Backbone.Model.prototype.initialize.apply(this, arguments);
            this.set('media', this.get('media') || []);
		},

        getMedia: function () {
            return this.get('media');
        },

        setMedia: function (mediaList) {
            this.set('media', mediaList);
        },

        getPhotoVideoModels: function (dataManager) {
            return new Backbone.Collection(
                this.get('media').filter(item => (item.type !== 'audio'))
                    .map(item => dataManager.getCollection(item.type).get(item.id))
                    .filter(item => (item != null))
            );
        },

        getAudioCollection: function (dataManager) {
            return new Backbone.Collection(
                this.get('media').filter(item => (item.type === 'audio'))
                    .map(item => dataManager.getAudio(item.id))
                    .filter(item => (item != null))
            );
        }
    });
    return TitleCard;
});
