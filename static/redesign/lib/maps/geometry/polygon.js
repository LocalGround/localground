define(["lib/maps/geometry/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var Polygon = function () {
        Polyline.call(this);

        this.getGeoJSON = function (googlePath) {
            var pathCoords = googlePath.getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            //add last coordinate again:
            coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
            return { type: 'Polygon', coordinates: [coords] };
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
                coords = geoJSON.coordinates[0],
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            path.pop();
            return path;
        };

        this.getCenterPoint = function (googleOverlay) {
            return this.getBounds(googleOverlay).getCenter();
        };

        this.getCenterPointFromGeoJSON = function (geoJSON) {
            var coords = this.getGooglePath(geoJSON),
                bounds = new google.maps.LatLngBounds(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds.getCenter();
        };
    };
    return Polygon;

});