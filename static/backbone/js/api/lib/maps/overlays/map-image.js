define(["lib/maps/overlays/base", "lib/maps/overlays/infobubbles/photo"], function (Base, PhotoBubble) {
    "use strict";
    /**
     * Class that controls map image overlays.
     */
    var MapImageOverlay = Base.extend({

        modelEvents: {
            'show-overlay': 'show',
            'hide-overlay': 'hide',
            'zoom-to-overlay': 'zoomTo'
        },
        initialize: function (opts) {
            var that = this;
            Base.prototype.initialize.apply(this, arguments);
            this.redraw();
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            Base.prototype.show.apply(this);
            this.redraw();
        },

        redraw: function () {
            //this._overlay.setIcon(this.getIcon());
        },
        initInfoBubble: function (opts) {
            this.infoBubble = new PhotoBubble(_.extend({overlay: this}, opts));
        }
    });
    return MapImageOverlay;
});