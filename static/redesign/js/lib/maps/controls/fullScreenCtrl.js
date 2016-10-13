/**
 * Created by zmmachar on 2/18/15.
 */
define(['jquery',
        'backbone',
            'text!' + templateDir + '/mapControls/fullScreenCtrl.html'],
    function ($, Backbone, CtrlTemplate) {
        "use strict";
        /**
         * Class that adds an audio player to a DOM element.
         * @class AudioPlayer
         * @param {DOM element} el The element to which to attach the audio player
         */
        var FullScreenCtrl = Backbone.View.extend({
            id: 'full-screen',

            template: CtrlTemplate,

            expand: "fa fa-expand",

            compress: "fa fa-compress",

            initialize: function (opts) {
                this.map = opts.map;
                this.container = opts.el;
                this.el = this.template;
                this.$el = $(this.el);
                $('#' + this.container).append(this.$el);
                this.$el.click(this.toggleFullScreen.bind(this));
            },
            toggleFullScreen: function () {
                var mapContainer = document.getElementById(this.container);
                if (!document.fullscreenElement &&    // alternative standard method
                    !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                    if (mapContainer.requestFullscreen) {
                        mapContainer.requestFullscreen();
                    } else if (mapContainer.msRequestFullscreen) {
                        mapContainer.msRequestFullscreen();
                    } else if (mapContainer.mozRequestFullScreen) {
                        mapContainer.mozRequestFullScreen();
                    } else if (mapContainer.webkitRequestFullscreen) {
                        mapContainer.webkitRequestFullscreen();
                    }

                    this.$el.attr('class', this.compress);
                    this.$el.text('  Exit');
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                    this.$el.attr('class', this.expand);
                    this.$el.text('  Expand');
                }

                google.maps.event.trigger(this.map, 'resize');
            }

        });

        return FullScreenCtrl;

    });