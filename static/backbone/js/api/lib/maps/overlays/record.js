define(["lib/maps/overlays/base"], function (Base) {
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
            return {
                fillColor: "#CCC",
                markerSize: 30,
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                path: this._overlay.Shapes.MAP_PIN_HOLLOW,
                anchor: new google.maps.Point(16, 5),
                scale: 1.6
            };
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