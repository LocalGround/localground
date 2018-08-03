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
                return new Backbone.Collection(
                    this.model.get('media').filter(item => {
                        return item.type !== 'audio';
                    }).map(item => {
                        return dm.getCollection(item.type).get(item.id);
                    }).filter(item => {
                        return item != null;
                    })
                );
            },

            getAudioModels: function () {
                const dm = this.app.dataManager;
                return new Backbone.Collection(
                    this.model.get('media').filter(item => {
                        return item.type === 'audio';
                    }).map(item => {
                        return dm.getAudio(item.id);
                    }).filter(item => {
                        return item != null;
                    })
                );
            },

            templateHelpers: function () {
                return {
                    header: this.model.get('title'),
                    description: this.model.get('description')
                }
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
