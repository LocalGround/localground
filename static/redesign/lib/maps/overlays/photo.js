define(["lib/maps/overlays/base", "lib/maps/overlays/infobubbles/photo"], function (Base, PhotoBubble) {
    "use strict";
    /**
     * Class that controls photo model overlays.
     * Todo: make a google marker class that the Photo,
     * Audio, PointMarker, and Record class can consume
     * @class Photo
     */
    var Photo = Base.extend({
        /**
         * Retrieve a photo map marker, depending on the map's zoom level
         * @returns google.maps.MarkerImage
         */
        getIcon: function () {
            return {
                path: 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
                scale: 2,
                fillColor: '#7084c2',
                fillOpacity: 1,
                strokeColor: '#f6f6f6',
                strokeWeight: 1
            };
        },

        getIconActive: function () {
            return {
                path: 'M-2,0a2,2 0 1,0 4,0a2,2 0 1,0 -4,0',
                scale: 2,
                fillColor: '#7084c2',
                fillOpacity: 1,
                strokeColor: '#7084c2',
                strokeWeight: 10
            };
        },

        /** adds icon to overlay. */
        initialize: function (opts) {
            var that = this;
            Base.prototype.initialize.apply(this, arguments);
            this.redraw();
            google.maps.event.addListener(this.map, 'zoom_changed', function () {
                that.getGoogleOverlay().setIcon(that.getIcon());
            });
        },

        /** shows the google.maps overlay on the map. */
        show: function () {
            Base.prototype.show.apply(this);
            this.redraw();
        },

        redraw: function () {
            this._overlay.setIcon(this.getIcon());
        },
        initInfoBubble: function (opts) {
            this.infoBubble = new PhotoBubble(_.extend({overlay: this}, opts));
        }
    });
    return Photo;
});