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
                'click' : 'jumpToTime',
                'timeupdate' : 'playerDurationUpdate'
            },
            audio: null,
            template: Handlebars.compile(PlayerTemplate),
            initialize: function (opts) {
                opts = opts || {};
                _.extend(this, opts);
                this.render();
                console.log(this.$el);
                this.audio = this.$el.find(".audio").get(0);
            },
            templateHelpers: function () {
                return {

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
                // As of now, I do not see the green color playing over the
                // progress bar
                var posX = this.$el.find(e.target).offset().left,
                    w = (e.pageX - posX) / this.$el.width();
                this.audio.currentTime = w * this.audio.duration;
            },

            playerDurationUpdate: function(){
                // As of now, I do not see the green color playing over the
                // progress bar
                this.$el.find(".progress > div").width(this.audio.currentTime /
                                     this.audio.duration * 100 + "%");
            }
            /*

            // Will be used to integrate with the rest of the file

var audio = $(".audio").get(0);

var toggle = function () {
    if (audio.paused) {
        audio.play();
        $("#play").addClass("pause");
    } else {
        audio.pause();
        $("#play").removeClass("pause");
    }
}

$(".fa-plus-circle").bind("click", function () {
    audio.volume += ((audio.volume + .1) < 1) ? .1 : 0;
});

$(".fa-minus-circle").bind("click", function () {
    audio.volume -= ((audio.volume - .1) > 0) ? .1 : 0;
});

$("#progress").bind("click", function (e) {
    var posX = $(e.target).offset().left,
        w = (e.pageX - posX) / $(this).width();
    audio.currentTime = w * audio.duration;
    if (audio.paused) {
        audio.play();
    }
});

$("audio").bind('timeupdate', function () {
    $("#progress > div").width(audio.currentTime / audio.duration * 100 + "%");
});
            */

        });
        return Modal;
    });
