define(["views/maps/sidepanel/items/item"], function (Item) {
    "use strict";
    /**
     * Class that controls photo Models. Extend the
     * {@link localground.maps.views.Item} class.
     * @class PhotoItem
     */
    var PhotoItem = Item.extend({
        /**
         * @lends localground.maps.views.PhotoItem#
         */

        /**
         * Retrieve a photo map marker, depending on the map's zoom level
         * @returns google.maps.MarkerImage
         */
        getIcon: function () {
            if (this.map.getZoom() > 18) {
                return this.model.get("path_small");
            }
            if (this.map.getZoom() > 16) {
                return new google.maps.MarkerImage(
                    this.model.get("path_marker_lg"),   // icon
                    new google.maps.Size(52, 52),       // size (width, height)
                    new google.maps.Point(0, 0),        // origin (x, y)
                    new google.maps.Point(26, 26)       // anchor (x, y)
                );
            }

            return new google.maps.MarkerImage(
                this.model.get("path_marker_sm"),   // icon
                new google.maps.Size(20, 20),       // size (width, height)
                new google.maps.Point(0, 0),        // origin (x, y)
                new google.maps.Point(10, 10)       // anchor (x, y)
            );

        },

        /**
         * Creates a google.maps.Marker overlay with a photo icon
         * if one doesn't already exist, and returns it.
         * @returns {google.maps.Marker}
         */
        getGoogleOverlay: function () {
            if (!this.googleOverlay) {
                this.googleOverlay = new google.maps.Marker({
                    position: this.getGoogleLatLng()
                });
            }
            this.googleOverlay.setIcon(this.getIcon());
            return this.googleOverlay;
        }

    });
    return PhotoItem;
});