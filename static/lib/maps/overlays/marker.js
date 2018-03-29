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
            console.log('Marker init');
            _.extend(this, opts);
            Base.prototype.initialize.apply(this, arguments);
            // this is what redraws a marker when you select it
            console.log(this);
            this.redraw();
            //listen to all of these Symbol change events and re-render:
            ['fillColor', 'strokeColor', 'shape', 'width',
            'fillOpacity', 'strokeWeight'].forEach(attr => {
                this.listenTo(this.symbol, `change:${attr}`, this.redraw);
            });
        },

        initInfoBubble: function (opts) {
            //TO DO: make one infobubble for entire basemap, not at the marker-level.
            this.infoBubble = new MarkerBubble(_.extend({overlay: this}, opts));
        },

        redraw: function () {
            console.log('marker redraw', this);
            if (this.getShapeType() === "Point") {
                if (this.active) {
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
