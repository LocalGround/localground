define(["backbone"], function (Backbone) {
    "use strict";
    var TitleCard = Backbone.Model.extend({
        // this does not correspond w/API endpoint, but useful for organizing
        // functionality
        getPhotoVideoModels: function (dataManager) {
            const media = this.get('media') || [];
            return new Backbone.Collection(
                media.filter(item => (item.type !== 'audio'))
                    .map(item => dataManager.getCollection(item.type).get(item.id))
                    .filter(item => (item != null))
            );
        },

        getAudioCollection: function (dataManager) {
            const media = this.get('media') || [];
            return new Backbone.Collection(
                media.filter(item => (item.type === 'audio'))
                    .map(item => dataManager.getAudio(item.id))
                    .filter(item => (item != null))
            );
        }
    });
    return TitleCard;
});
