define([
    "lib/maps/geometry/point",
    "lib/maps/geometry/polyline",
    "lib/maps/geometry/polygon"
], function (Point, Polyline, Polygon) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Point
     */
    var Geometry = function () {
        this.point = null;
        this.polyline = null;
        this.polygon = null;

        this.getGeoJSON = function (googleObject) {
            if (googleObject instanceof google.maps.LatLng) {
                return this.point.getGeoJSON(googleObject);
            }
            if (googleObject instanceof google.maps.Marker) {
                return this.point.getGeoJSON(googleObject.position);
            }
            if (googleObject instanceof google.maps.Polyline) {
                return this.polyline.getGeoJSON(googleObject.getPath());
            }
            if (googleObject instanceof google.maps.Polygon) {
                return this.polygon.getGeoJSON(googleObject.getPath());
            }

            alert("Not an instance of a defined type!");
            return null;

        };

        this.initialize = function () {
            this.point = new Point();
            this.polyline = new Polyline();
            this.polygon = new Polygon();
        };

        this.initialize();

    };
    return Geometry;
});