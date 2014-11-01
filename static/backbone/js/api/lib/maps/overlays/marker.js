define([
	"lib/maps/overlays/infobubbles/marker",
    "lib/maps/overlays/base"
], function (MarkerBubble, Base) {
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
                path: this._overlay.Shapes.MAP_PIN_HOLLOW,
                scale: 1.6,
                anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                size: new google.maps.Size(15, 30),         // size (width, height)
                origin: new google.maps.Point(0, 0)        // origin (x, y)
            };
        },

        highlight: function () {
            if (this.getShapeType() != "Point") {
                return;
            }
            if (!this.highlightMarker) {
                this.highlightMarker = new google.maps.Marker({
                    position: this.getCenter(),
                    icon: {
                        path: this._overlay.Shapes.OVAL,
                        fillColor: '#BCE8F1',
                        strokeColor: '#3A87AD',
                        strokeWeight: 2.5,
                        fillOpacity: 0.5,
                        scale: 1.6
                    },
                    map: this.map,
                    zIndex: 1
                });
            } else {
                this.highlightMarker.setPosition(this.getCenter());
                //this if-condition helps with blinking...
                if (!this.highlightMarker.getMap()) {
                    this.highlightMarker.setMap(this.map);
                }
            }
        },

        unHighlight: function () {
            if (this.highlightMarker) {
                this.highlightMarker.setMap(null);
            }
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
                Base.prototype.redraw.apply(this, arguments);
            }
        }

    });
    return Marker;
});