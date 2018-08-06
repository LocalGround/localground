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

            renderCarousel: function () {
                const dm = this.app.dataManager;
                const photosVideos = this.model.getPhotoVideoModels(dm);
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
                const dm = this.app.dataManager;
                this.model.getAudioCollection(dm).each(audioModel => {
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
