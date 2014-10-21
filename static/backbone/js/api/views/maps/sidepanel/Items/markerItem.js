define([
    "underscore",
    "views/maps/sidepanel/items/item",
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline"
], function (_, Item, Point, Polyline) {
    "use strict";
    /**
     * Class that controls photo Models. Extend the
     * {@link localground.maps.views.Item} class.
     * @class MarkerItem
     */
    var MarkerItem = Item.extend({
        /**
         * @lends localground.maps.views.MarkerItem#
         */


        /**
         * Creates a google.maps.Marker overlay with a photo icon
         * if one doesn't already exist, and returns it.
         * @returns {google.maps.Marker}
         */
        getGoogleOverlay: function () {
            if (!this.googleOverlay) {
                var geoJSON = this.model.get("geometry");
                switch (geoJSON.type) {
                case 'Point':
                    this.googleOverlay = new google.maps.Marker({
                        position: Point.getGoogleLatLng(geoJSON)
                    });
                    break;
                case 'LineString':
                    //console.log(geoJSON);
                    this.googleOverlay = new google.maps.Polyline({
                        path: Polyline.getGooglePath(geoJSON),
                        strokeColor: this.model.get("color"),
                        strokeOpacity: 1.0,
                        strokeWeight: 5
                    });
                    //console.log(this.googleOverlay);
                    break;
                /*case 'Polygon':
                 me.data.push(new localground.polygon(this));
                 break;
                 */
                default:
                    alert('Unknown Geometry Type');
                }
            }
            return this.googleOverlay;
        },

        templateHelpers: function () {
            return _.extend({}, Item.prototype.templateHelpers.call(this), {
                descriptiveText: this.model.getDescriptiveText(),
                geometryType: this.getGeometryType()
            });
        },

        getGeometryType: function () {
            if (this.model.get('geometry')) {
                return this.model.get('geometry').type;
            }

            return "";

        }

    });
    return MarkerItem;
});