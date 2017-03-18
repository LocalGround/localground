define(["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var Polygon = function (app, opts) {
        Polyline.call(this, app, opts);

        this.getShapeType = function () {
            return "Polygon";
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polygon({
                path: this.getGoogleLatLngFromModel(),
                strokeColor: '#' + this.model.get("color"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                fillColor: '#' + this.model.get("color"),
                fillOpacity: 0.35,
                map: isShowingOnMap ? this.map : null
            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                strokeColor: '#' + this.model.get("color"),
                fillColor: '#' + this.model.get("color")
            });
        };
        /**
         * Method that converts a GeoJSON Linestring into
         * an array of google.maps.LatLng objects.
         * @param {GeoJSON Linestring} geoJSON
         * A GeoJSON Linestring object
         * @returns {Array}
         * An array of google.maps.LatLng objects.
         */
        this.getGoogleLatLngFromModel = function () {
            var geoJSON = this.model.get("geometry"),
                path = [],
                coords = geoJSON.coordinates[0],
                i = 0;
            for (i; i < coords.length; i++) {
                path.push(new google.maps.LatLng(coords[i][1], coords[i][0]));
            }
            path.pop();
            return path;
        };

        this.getCenterPoint = function () {
            return this.getBounds().getCenter();
        };

        /**
         * Method that converts a google.maps.Polygon
         * into a GeoJSON Linestring object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
         * documentation for more details.
         * @returns a GeoJSON Polygon object
         */
        this.getGeoJSON = function () {
            var pathCoords = this._googleOverlay.getPath().getArray(),
                coords = [],
                i = 0;
            for (i; i < pathCoords.length; i++) {
                coords.push([pathCoords[i].lng(), pathCoords[i].lat()]);
            }
            //add last coordinate again:
            coords.push([pathCoords[0].lng(), pathCoords[0].lat()]);
            return { type: 'Polygon', coordinates: [coords] };
        };

		this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);
    };
    return Polygon;
});