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
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, arguments);
            // this is what redraws a marker when you select it
            this.redraw();
            this.listenTo(this.symbol, 'change:fillColor', this.redraw);
            this.listenTo(this.symbol, 'change:shape', this.redraw);
            this.listenTo(this.symbol, 'change:width', this.redraw);
            this.listenTo(this.symbol, 'change:fillOpacity', this.redraw);
            this.listenTo(this.symbol, 'change:strokeWeight', this.redraw);
        },

        initInfoBubble: function (opts) {
            //TO DO: make one infobubble for entire basemap, not at the marker-level.
            this.infoBubble = new MarkerBubble(_.extend({overlay: this}, opts));
        },

        redraw: function () {
            if (this.getShapeType() === "Point") {
                if (this.model.get("active")) {
                    var icon = {};
                    _.extend(icon, this.getGoogleIcon(), { strokeWeight: 10, strokeOpacity: 0.5 });
                    icon.strokeColor = icon.fillColor;
                    this.getGoogleOverlay().setIcon(icon);
                    if (this.app.mode == 'view') {
                        this._overlay.makeViewable(this.model);
                    } else {
                        this._overlay.makeEditable(this.model);
                    }
                } else {
                    if (this.getGoogleIcon()) {
                        this._overlay.setIcon(this.getGoogleIcon());
                        this._overlay.makeViewable(this.model);
                    }
                }
            } else {
                this._overlay.redraw();
            }
        }

    });
    return Marker;
});
