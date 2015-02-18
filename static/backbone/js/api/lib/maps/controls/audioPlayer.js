/**
 * Created by zmmachar on 11/3/14.
 */
define(['jquery',
        'marionette',
        'underscore',
            'text!' + templateDir + '/mapControls/audioPlayer.html'],
    function ($, Backbone, _, PlayerTemplate) {
        "use strict";
        /**
         * Class that adds an audio player to a DOM element.
         * @class AudioPlayer
         * @param {DOM element} el The element to which to attach the audio player
         */
        var AudioPlayer = Backbone.View.extend({
            template: _.template(PlayerTemplate),
            id: 'audio-wrapper',
            events: {
                'click #close-player': 'closePlayer'
            },

            initialize: function (opts) {
                this.container = opts.el;
                this.$el = $('<div></div>');
                this.$el.attr('id', this.id).attr('class', 'hidden');
                $('#' + this.container).append(this.$el);
                this.app = opts.app;
                this.listenTo(this.app.vent, 'playAudio', this.playAudio);
                this.listenTo(this.app.vent, 'stopAudio', this.stopAudio);
            },
            playAudio: function (model) {
                this.stopAudio();
                this.model = model;
                this.model.trigger('play');
                this.$el.empty();
                this.$el.append(this.template(model.toJSON()));
                this.$el.removeClass('hidden');
                this.currentAudio = this.$el.find('audio')[0];
                this.currentAudio.play();
            },
            stopAudio: function () {
                this.$el.addClass('hidden');

                if (this.currentAudio) {
                    this.currentAudio.pause();
                    this.currentAudio.currentTime = 0;
                }
                if (this.model) {
                    this.model.trigger('stop');
                }

            },
            closePlayer: function () {
                this.stopAudio();
            }
        });

        return AudioPlayer;

    });