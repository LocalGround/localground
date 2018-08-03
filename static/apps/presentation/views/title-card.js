define(["underscore",
        "marionette",
        "handlebars",
        "lib/carousel/carousel",
        "collections/audio",
        "lib/audio/audio-player",
        "text!../templates/title-card.html"
    ],
    function (_, Marionette, Handlebars, Carousel, Audio, AudioPlayer, TitleCard) {
        'use strict';
        var TitleCard = Marionette.ItemView.extend({

            template: Handlebars.compile(TitleCard),

            initialize: function (opts) {
                _.extend(this, opts);
            },

            getPhotoVideoModels: function () {
                const dm = this.app.dataManager;
                const media = this.model.get('media') || [];
                return new Backbone.Collection(
                    media.filter(item => (item.type !== 'audio'))
                        .map(item => dm.getCollection(item.type).get(item.id))
                        .filter(item => (item != null))
                );
            },

            getAudioModels: function () {
                const dm = this.app.dataManager;
                const media = this.model.get('media') || [];
                return new Backbone.Collection(
                    media.filter(item => (item.type === 'audio'))
                        .map(item => dm.getAudio(item.id))
                        .filter(item => (item != null))
                );
            },

            renderCarousel: function () {
                const photosVideos = this.getPhotoVideoModels();
                if (photosVideos.length > 0) {
                    const carousel = new Carousel({
                        model: this.model,
                        app: this.app,
                        collection: photosVideos,
                        panelStyles: null
                    });
                    this.$el.find(".carousel").append(carousel.$el);
                }
            },

            renderAudioPlayers: function () {
                this.getAudioModels().each(audioModel => {
                    const player = new AudioPlayer({
                        model: audioModel,
                        audioMode: "detail",
                        className: "audio-detail",
                        app: this.app
                    });
                    this.$el.find(".audio-players").append(player.$el);
                });
            },

            onRender: function () {
                this.renderCarousel();
                this.renderAudioPlayers();
            }
        });
        return TitleCard;
    });
