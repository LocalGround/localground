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
            this.redraw();
        },

        initInfoBubble: function (opts) {
            this.infoBubble = new MarkerBubble(_.extend({overlay: this}, opts));
        },

        redraw: function () {
            if (this.getShapeType() === "Point") {
                if (this.model.get("active")) {
                    var icon = {};
                    _.extend(icon, this.getGoogleIcon(), { strokeWeight: 10, strokeOpacity: 0.5 });
                    icon.strokeColor = icon.fillColor;
                    this.getGoogleOverlay().setIcon(icon);
                } else {
                    if (this.getGoogleIcon()) {
                        this._overlay.setIcon(this.getGoogleIcon());
                    }
                }
            } else {
                this._overlay.redraw();
            }
        }

    });
    return Marker;
});