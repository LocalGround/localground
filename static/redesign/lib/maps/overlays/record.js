define(["underscore", "lib/maps/overlays/base"], function (_, Base) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var Record = Base.extend({

        /**
         * Get the corresponding SVG marker icon
         * @returns {Object} icon definition
         */
		getIcon: function () {
            var opts = _.clone(this._overlay.Shapes.MAP_PIN_HOLLOW);
            _.extend(opts, {
                fillColor: "#CCC",
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                scale: 1.6
            });
            return opts;
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
    return Record;
});