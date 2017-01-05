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
            if (this.map.getZoom() > 18) {
                return {
                    url: this.model.get("path_small"),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(50, 0)
                };
            }
            if (this.map.getZoom() > 16) {
                return {
                    url: this.model.get("path_marker_lg"),
                    size: new google.maps.Size(52, 52),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(26, 0)
                };
            }
            return {
                url: this.model.get("path_marker_sm"),
                size: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(10, 0)
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