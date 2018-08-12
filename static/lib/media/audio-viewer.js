
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/audio/audio-player",
    "text!./audio-viewer.html"
], function (_, Handlebars, Marionette, AudioPlayer, AudioViewerTemplate) {
    "use strict";
    var AudioViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(AudioViewerTemplate),
        initialize: function (opts) {
            _.extend(this, opts);
            this.templateType = this.templateType || 'standard';
            this.render();
        },
        events: {
            'click .detach_media': 'relayDetachMedia',
            'click .edit': 'editAudioFile'
        },
        //className: 'media-items_wrapper',
        templateHelpers: function () {
            const showHeader = this.audioCollection.length > 0 && this.templateType === 'standard';
            console.log(this.audioCollection.toJSON());
            return {
                audio: this.audioCollection.toJSON(),
                showHeader: showHeader,
                templateType: this.templateType
            };
        },
        onRender: function() {
            this.renderAudioPlayers();
        },
        renderAudioPlayers: function () {
            this.audioCollection.each(item => {
                const player = new AudioPlayer({
                    model: item,
                    audioMode: "basic",
                    app: this.app
                });
                this.$el.append(player.$el);
            });
        },
        relayDetachMedia: function(e) {
            this.detachMedia(e);
        },
        editAudioFile: function (e) {
            const audioID = parseInt($(e.target).attr('data-id'));
            const audioModel = this.audioCollection.get(audioID);
            alert(audioModel.get('name'));
        }
    });
    return AudioViewer;
});
