define(["jquery", "lib/maps/overlays/base"], function ($, Base) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * Extends @link {localground.maps.overlays.Point}.
     * @class Audio
     */
    var Symbolized = Base.extend({
        symbol: null,
        Symbols: {
            PIN: "pin",
            CIRCLE: "circle"
        },
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
            var opts = {
                    fillColor: this.symbol.color,
                    markerSize: 30,
                    strokeColor: "#FFF",
                    strokeWeight: 1.5,
                    fillOpacity: 1
                },
                baseSize = 30.0,
                size = this.symbol.width;
            if (this.symbol.shape == "circle") {
                baseSize = 40.0,
                $.extend(opts, {
                    markerSize: baseSize,
                    path: this._overlay.Shapes.CIRCLE,
                    scale: size / baseSize,
                    anchor: new google.maps.Point(0, 5),
                    size: new google.maps.Size(baseSize, baseSize),
                    origin: new google.maps.Point(0, 0)
                });
            } else if (this.symbol.shape == "square") {
                baseSize = 100;
                $.extend(opts, {
                    markerSize: baseSize,
                    path: this._overlay.Shapes.ROUNDED,
                    scale: size / baseSize,
                    anchor: new google.maps.Point(0, -1 * baseSize / 2),
                    size: new google.maps.Size(baseSize, baseSize),
                    origin: new google.maps.Point(100, 100)
                });
            } else {
                $.extend(opts, {
                    markerSize: baseSize,
                    path: this._overlay.Shapes.MAP_PIN_HOLLOW,
                    scale: 1.6,
                    anchor: new google.maps.Point(16, 30),      // anchor (x, y)
                    size: new google.maps.Size(15, 30),         // size (width, height)
                    origin: new google.maps.Point(0, 0)        // origin (x, y)    
                });
            }
            return opts;
        },

        /** adds icon to overlay. */
        initialize: function (opts) {
            Base.prototype.initialize.apply(this, arguments);
            this.symbol = opts.symbol;
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
    return Symbolized;
});