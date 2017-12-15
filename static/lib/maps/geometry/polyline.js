define([], function () {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polyline
     */
    var Polyline = function () {

        /**
         * Method that converts a google.maps.Polyline
         * into a GeoJSON Linestring object.
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
         * documentation for more details.
         * @returns a GeoJSON Linestring object
         */
        this.getGeoJSON = function (googlePath) {
            var pathCoords = googlePath.getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            return { type: 'LineString', coordinates: coords };
        };

        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGooglePath = function (geoJSON) {
            var path = [],
                coords = geoJSON.coordinates,
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            return path;
        };

        /**
         * Method that calculates the length of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {Number}
         * The length of the google.maps.Polyline object in miles.
         */
        this.calculateDistance = function (googlePolyline) {
            var coords = googlePolyline.getPath().getArray(),
                distance = 0,
                i = 0;
            for (i; i < coords.length; i++) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i - 1], coords[i]);
            }
            return Math.round(distance / 1609.34 * 100) / 100;
        };

        /**
         * Method that calculates the bounding box of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {google.maps.LatLngBounds}
         * The bounding box.
         */
        this.getBounds = function (googlePolyline) {
            var bounds = new google.maps.LatLngBounds(),
                coords = googlePolyline.getPath().getArray(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds;
        };

        /**
         * An approximation for the center point of a polyline.
         * @param {google.maps.Polyline} googlePolyline
         * @returns {google.maps.LatLng}
         * A latLng corresponding the approximate center of the
         * polyline.
         */
        this.getCenterPoint = function (googlePolyline) {
            var coordinates = googlePolyline.getPath().getArray();
            return coordinates[Math.floor(coordinates.length / 2)];
        };

        this.getCenterPointFromGeoJSON = function (geoJSON) {
            var path = this.getGooglePath(geoJSON);
            return path[Math.floor(path.length / 2)];
        };
    };
    return Polyline;
});