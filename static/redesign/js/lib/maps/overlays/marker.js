define([
    "underscore",
    "lib/maps/overlays/infobubbles/marker",
    "lib/maps/overlays/base"
], function (_, MarkerBubble, Base) {
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
            var opts = {
                fillColor: '#' + this.model.get("color"),
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1,
                scale: 1.6
            };
            _.extend(opts, _.clone(this._overlay.Shapes.MAP_PIN_HOLLOW));
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
            //this.highlight();
        },

        initInfoBubble: function (opts) {
            this.infoBubble = new MarkerBubble(_.extend({overlay: this}, opts));
        },

        redraw: function () {
            if (this.getShapeType() === "Point") {
                this._overlay.setIcon(this.getIcon());
            } else {
                this._overlay.redraw();
            }
        }

    });
    return Marker;
});