
define([
    "underscore",
    "handlebars",
    "marionette",
    "lib/modals/modal",
    "lib/audio/audio-player",
    "text!./audio-viewer.html"
], function (_, Handlebars, Marionette, Modal, AudioPlayer, AudioViewerTemplate) {
    "use strict";
    var AudioViewer = Marionette.ItemView.extend({
        template: Handlebars.compile(AudioViewerTemplate),
        initialize: function (opts) {
            //opts.model = opts.activeMap;
            _.extend(this, opts);
            this.modal = this.app.modal;
            // this.secondaryModal = new Modal({
            //     app: this.app
            // });
            this.popover = this.app.popover;

            this.render();
        },
        events: {
            //'click .photo-icon_wrapper': 'showMediaBrowser',
            'click .detach_media': 'relayDetachMedia'
        },

        className: 'media-items_wrapper',

        templateHelpers: function () {
            let audio = [];

            this.audioCollection.each((model) => {
                audio.push({
                    id: model.get('id'),
                    videoname_id: model.get('name')
                });
            });

            return {
                audio: audio,
                showHeader: (this.audioCollection.length > 0)
            };
        },

        onRender: function() {
            this.renderAudioPlayers();
        },

        renderAudioPlayers: function () {
            var audio_attachments = [],
                that = this,
                player,
                $elem;
            if (this.audioCollection) {
                audio_attachments = this.audioCollection;
            }
            this.audioCollection.each(function (item) {
                $elem = that.$el.find(".audio-basic[data-id='" + item.id + "']")[0];
                player = new AudioPlayer({
                    model: item,
                    audioMode: "basic",
                    app: that.app
                });
                $elem.append(player.$el[0]);
            });
        },

        relayDetachMedia: function(e) {
            this.detachMedia(e);
        }
    });
    return AudioViewer;
});
