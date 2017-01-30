/**
 * Created by zmmachar on 12/17/14.
 */
define(["jquery", "underscore", "marionette", "handlebars", "text!../audio/audio-player.html"],
    function ($, _, Marionette, Handlebars, PlayerTemplate) {
        'use strict';
        /**
         * The Printloader class handles loading data for the print generation form
         * @class PrintLoader
         */
        var Modal = Marionette.ItemView.extend({
            events: {
                'click .close': 'hide',
                'click .close-modal': 'hide',
                'click .volUp': 'volumeUp',
                'click .volDown': 'volumeDown',
                'click .play' : 'togglePlay',
                'click .progress .audio-progress-bar' : 'jumpToTime'
            },
            audio: null,
            template: Handlebars.compile(PlayerTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                this.audio = this.$el.find(".audio").get(0);
                _.bindAll(this,'playerDurationUpdate');
                this.$el.find('audio').on('timeupdate', this.playerDurationUpdate);
            },
            templateHelpers: function () {
                return {
                    audioMode: this.audioMode
                };
            },

            togglePlay: function(){
                if (this.audio.paused) {
                    this.audio.play();
                    this.$el.find(".play").addClass("pause");
                } else {
                    this.audio.pause();
                    this.$el.find(".play").removeClass("pause");
                }
            },

            volumeUp: function(){
                this.audio.volume += ((this.audio.volume + .1) < 1) ? .1 : 0;
            },

            volumeDown: function(){
                this.audio.volume -= ((this.audio.volume - .1) > 0) ? .1 : 0;
            },

            jumpToTime: function(e){
                var posX = this.$el.find(e.target).offset().left,
                    w = (e.pageX - posX) / this.$el.width();
                this.audio.currentTime = w * this.audio.duration;
            },

            playerDurationUpdate: function(){

                this.$el.find(".audio-progress-duration").width(this.audio.currentTime /
                                     this.audio.duration * 100 + "%");
                this.$el.find(".audio-progress-circle").css({
                    left: this.audio.currentTime / this.audio.duration * 100 + "%"
                });
                this.$el.find(".time-current").html(this.getCurrentTime());
                this.$el.find(".time-duration").html(this.getDuration());
            },

            formatTime: function(timeCount){
                var seconds = timeCount;
                var minutes = Math.floor(seconds / 60);
                minutes = (minutes >= 10) ? minutes : "0" + minutes;
                seconds = Math.floor(seconds % 60);
                seconds = (seconds >= 10) ? seconds : "0" + seconds;
                return minutes + ":" + seconds;
            },

            getDuration: function(){
                return this.formatTime(this.audio.duration);
            },

            getCurrentTime: function(){
                return this.formatTime(this.audio.currentTime);

            }

        });
        return Modal;
    });
