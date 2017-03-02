define(["underscore", "marionette", "handlebars", "text!../audio/audio-player.html"],
    function (_, Marionette, Handlebars, PlayerTemplate) {
        'use strict';

        var AudioPlayer = Marionette.ItemView.extend({
            events: {
                'click .close': 'hide',
                'click .close-modal': 'hide',
                'click .volUp': 'volumeUp',
                'click .volDown': 'volumeDown',
                'click .play' : 'togglePlay',
                'click .skip-fwd' : 'skipForward',
                'click .skip-back' : 'skipBackward',
                'click .progress-container' : 'jumpToTime'
            },
            suspendUIUpdate: false,
            audio: null,
            template: Handlebars.compile(PlayerTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                this.audio = this.$el.find(".audio").get(0);
                this.listenTo(this.app.vent, 'audio-carousel-advanced', this.stop);

                // need to attach audio events directly to the element b/c the
                // HTML5 audio events work slightly differently than other element
                // events:
                _.bindAll(this, 'playerDurationUpdate');
                this.$el.find('audio').on('timeupdate', this.playerDurationUpdate);
                this.$el.find('audio').on('ended', this.showPlayButton.bind(this));
            },
            onRender: function () {
                var that = this;
                if (!this.$el.find('.progress-container').get(0)) {
                    return;
                }
                // setTimeout necessary b/c need to wait 'til rendered audio player
                // has been attached to the DOM in order to calculate the offset
                setTimeout(function () {
                    var $c = this.$el.find('.progress-container'),
                        x = $c.offset().left,
                        w = $c.width(),
                        containment = [x, 0, x + w + 5, 0];
                    this.$el.find(".audio-progress-circle").draggable({
                        axis: "x",
                        containment: containment, //[ x1, y1, x2, y2 ]
                        start: that.seek.bind(that),
                        stop: that.jumpToTime.bind(that)
                    });
                }.bind(this), 100);
            },
            templateHelpers: function () {
                return {
                    audioMode: this.audioMode
                };
            },
            stop: function () {
                this.showPlayButton();
                this.audio.pause();
            },
            showPauseButton: function () {
                this.$el.find(".play").addClass("pause");
            },
            showPlayButton: function () {
                this.$el.find(".play").removeClass("pause");
            },
            togglePlay: function () {
                if (this.audio.paused) {
                    this.audio.play();
                    this.showPauseButton();
                } else {
                    this.audio.pause();
                    this.showPlayButton();
                }
            },
            volumeUp: function () {
                this.audio.volume += ((this.audio.volume + 0.1) < 1) ? 0.1 : 0;
            },
            volumeDown: function () {
                this.audio.volume -= ((this.audio.volume - 0.1) > 0) ? 0.1 : 0;
            },
            jumpToTime: function (e) {
                this.suspendUIUpdate = false;
                var $progressContainer = this.$el.find('.progress-container'),
                    posX = $progressContainer.offset().left,
                    w = (e.pageX - posX) / $progressContainer.width();
                this.audio.currentTime = w * this.audio.duration;
                if (this.audio.paused) {
                    this.showPauseButton();
                    this.audio.play();
                }
            },
            seek: function () {
                this.suspendUIUpdate = true;
            },
            skipForward: function () {
                if (this.audio.currentTime < this.audio.duration) {
                    var skipStep = this.audio.duration / 10;
                    this.audio.currentTime += skipStep;
                } else {
                    this.audio.currentTime = this.audio.duration;
                }
            },
            skipBackward: function () {
                if (this.audio.currentTime > 0) {
                    var skipStep = this.audio.duration / 10;
                    this.audio.currentTime -= skipStep;
                } else {
                    this.audio.currentTime = 0;
                }
            },
            playerDurationUpdate: function (e, pos) {
                if (this.suspendUIUpdate) {
                    return;
                }
                if (!pos) {
                    pos = this.audio.currentTime / this.audio.duration * 100 + "%";
                }
                this.$el.find(".audio-progress-duration").width(pos);
                this.$el.find(".audio-progress-circle").css({
                    "left": "calc(" + pos + ")"
                });
                this.$el.find(".time-current").html(this.getCurrentTime());
                this.$el.find(".time-duration").html(this.getDuration());
                e.preventDefault();
            },
            formatTime: function (timeCount) {
                var seconds = timeCount,
                    minutes = Math.floor(seconds / 60);
                minutes = (minutes >= 10) ? minutes : "0" + minutes;
                seconds = Math.floor(seconds % 60);
                seconds = (seconds >= 10) ? seconds : "0" + seconds;
                return minutes + ":" + seconds;
            },
            getDuration: function () {
                return this.formatTime(this.audio.duration);
            },
            getCurrentTime: function () {
                return this.formatTime(this.audio.currentTime);
            }
        });
        return AudioPlayer;
    });
