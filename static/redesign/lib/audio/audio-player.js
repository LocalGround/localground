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
                //*
                'click .audio-progress-duration' : 'jumpToTime',
                'click .audio-progress-bar' : 'jumpToTime',
                //*/
                'mousedown .audio-progress-circle' : 'seek',
                'mouseup .audio-progress-circle' : 'endDrag'
            },
            audio: null,
            template: Handlebars.compile(PlayerTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                this.audio = this.$el.find(".audio").get(0);
                _.bindAll(this, 'playerDurationUpdate');
                this.$el.find('audio').on('timeupdate', this.playerDurationUpdate);
                this.listenTo(this.app.vent, 'audio-carousel-advanced', this.stop);
                $( ".audio-progress-circle" ).draggable({ 
                    axis: "x",
                    containment: "parent"
                });
                
            },
            templateHelpers: function () {
                return {
                    audioMode: this.audioMode
                };
            },
            stop: function () {
                this.audio.pause();
            },

            togglePlay: function () {
                if (this.audio.paused) {
                    this.audio.play();
                    this.$el.find(".play").addClass("pause");
                } else {
                    this.audio.pause();
                    this.$el.find(".play").removeClass("pause");
                }
            },

            volumeUp: function () {
                this.audio.volume += ((this.audio.volume + 0.1) < 1) ? 0.1 : 0;
            },

            volumeDown: function () {
                this.audio.volume -= ((this.audio.volume - 0.1) > 0) ? 0.1 : 0;
            },

            jumpToTime: function (e) {
                //console.log(this.$el.find(e.target));
                var posX = this.$el.find(e.target).offset().left,
                    w = (e.pageX - posX) / this.$el.width();
                this.audio.currentTime = w * this.audio.duration;
            },

            seek: function(e){
                $( ".audio-progress-circle" ).draggable({ 
                    axis: "x",
                    containment: "parent"
                });
                
              /*  console.log("seek");
                var posX = this.$el.find(e.target).offset().left,
                  //  w = (e.pageX - posX) / this.$el.width();
                  w = (event.target.offsetLeft)/this.$el.find(".progress-container").width();
                  console.log(event.target.offsetLeft, this.$el.find(".progress-container").width());
                  console.log(w);
                  
                this.audio.currentTime = w * this.audio.duration;
                this.playerDurationUpdate();
                console.log(this.audio.currentTime); */
            },

            endDrag: function (e) {
                var posX = this.$el.find(e.target).offset().left,
                  //  w = (e.pageX - posX) / this.$el.width();
                  w = ((e.target).offsetLeft-40)/this.$el.find(".progress-container").width();
                  
                this.audio.currentTime = w * this.audio.duration;
                var pos = this.audio.currentTime /
                                     this.audio.duration * 100 + "%";
                this.playerDurationUpdate(e, pos);
                
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
                if (!pos) {
                var pos = this.audio.currentTime /
                                     this.audio.duration * 100 + "%";
                }
                this.$el.find(".audio-progress-duration").width(pos);
                this.$el.find(".audio-progress-circle").css({
                    "left": "calc(" + pos + " - 8px)"
                });
                this.$el.find(".time-current").html(this.getCurrentTime());
                this.$el.find(".time-duration").html(this.getDuration());
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
