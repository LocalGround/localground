define([
    "lib/maps/overlays/base"
], function (Base) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Overlay}.
     * @class Marker
     */
    var Marker = Base.extend({

        /**
         * Get the corresponding SVG marker icon
         * @returns {Object} icon definition
         */
        getIcon: function () {
            //return null;
            return {
                fillColor: '#' + this.model.get("color"),
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                path: this.overlay.Shapes.MAP_PIN_HOLLOW,
                scale: 1.6,
                anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                size: new google.maps.Size(15, 30),         // size (width, height)
                origin: new google.maps.Point(0, 0)        // origin (x, y)
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
            if (this.overlay.getType() === "Point") {
                this.overlay.setIcon(this.getIcon());
            } else {
                this.overlay.redraw();
            }
        }

    });
    return Marker;
});