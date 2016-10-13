define([
    "lib/maps/overlays/base",
    "lib/maps/overlays/infobubbles/audio",
    "underscore"
], function (Base, AudioBubble, _) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var Audio = Base.extend({

        /**
         * Get the corresponding SVG marker icon
         * @returns {Object} icon definition
         */
        getIcon: function () {
			var opts = this._overlay.Shapes.SOUND;
			_.extend(opts, {
                fillColor: "#333",
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                //anchor: new google.maps.Point(16, 5),
                scale: 1.6
            });
			return opts;
        },

        initInfoBubble: function (opts) {
            this.infoBubble = new AudioBubble(_.extend({overlay: this}, opts));
        },
        /** adds icon to overlay. */
        initialize: function () {
            Base.prototype.initialize.apply(this, arguments);
            this.redraw();
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            Base.prototype.show.apply(this);
            this.redraw();
        },

        redraw: function () {
            this._overlay.setIcon(this.getIcon());
        }
    });
    return Audio;
});