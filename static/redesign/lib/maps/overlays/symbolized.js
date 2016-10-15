define(["underscore",
        "lib/maps/overlays/infobubbles/symbolized",
        "lib/maps/overlays/base"], function (_, SymbolizedBubble, Base) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var Symbolized = Base.extend({
        symbol: null,
        modelEvents: {
            'change:geometry': 'updateOverlay',
            'change': 'render'
        },
        //symbol: 'pin',
        /**
         * Get the corresponding SVG marker icon
         * @returns {Object} icon definition
         */
        getIcon: function () {
            var opts, baseMarker;
            if (this.symbol.shape == "circle") {
                baseMarker = this._overlay.Shapes.CIRCLE;
            } else if (this.symbol.shape == "square") {
                baseMarker = this._overlay.Shapes.SQUARE;
            } else {
                baseMarker = this._overlay.Shapes.MAP_PIN_HOLLOW;
            }
            opts = {
                fillColor: this.symbol.color,
                markerSize: 30,
                strokeColor: "#FFF",
                strokeWeight: 1.5,
                fillOpacity: 1
            };
            _.extend(opts, _.clone(baseMarker));
            _.extend(opts, { scale: baseMarker.scale * this.symbol.width / baseMarker.markerSize });
            return opts;
        },

        /** adds icon to overlay. */
        initialize: function (opts) {
            // Because an OverlayGroup instance and a Layer instance may be
            // sharing the same models, it is important to initialize this flag as
            // *not showing, so that it's display status isnt' confounded with the
            // display status of a corresponding OverlayGroup.
            this._isShowingOnMap = false;
            Base.prototype.initialize.apply(this, arguments);
            this.symbol = opts.symbol;
            this.redraw();
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            Base.prototype.show.apply(this);
            this._overlay.setIcon(this.getIcon());
        },

        redraw: function () {
            if (this.symbol.isShowingOnMap) {
                this.show();
            } else {
                this.hide();
            }
        },
        initInfoBubble: function (opts) {
            this.infoBubble = new SymbolizedBubble(_.extend({overlay: this}, opts));
        }
    });
    return Symbolized;
});