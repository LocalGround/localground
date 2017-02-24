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

        initialize: function (opts) {
            Base.prototype.initialize.apply(this, arguments);
            _.extend(this, opts);
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
                if (this.model.get("active")) {
                    var icon = {};
                    _.extend(icon, this.getGoogleOverlay().getIcon(), { strokeWeight: 6 });
                    icon.strokeColor = icon.fillColor;
                    this.getGoogleOverlay().setIcon(icon);
                } else {
                    this._overlay.setIcon(this.getIcon());
                }
            } else {
                this._overlay.redraw();
            }
        }

    });
    return Marker;
});