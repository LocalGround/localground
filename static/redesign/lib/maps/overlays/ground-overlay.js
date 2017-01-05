define(["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var GroundOverlay = function (app, opts) {
        Polyline.call(this, app, opts);

        this.getShapeType = function () {
            return "GroundOverlay";
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.GroundOverlay(
                this.model.get("overlay_path"),
                new google.maps.LatLngBounds(
                    new google.maps.LatLng(this.model.get("south"), this.model.get("west")),
                    new google.maps.LatLng(this.model.get("north"), this.model.get("east"))
                ),
                {
                    map: isShowingOnMap ? this.map : null,
                    opacity: 1,
                    clickable: false
                }
            );
        };

        this.makeViewable = this.makeEditable = function (model) {
            return true;
        };

        this.getGoogleLatLngFromModel = function () {
            return null;
        };

        this.getCenter = this.getCenterPoint = function () {
            return this.getBounds().getCenter();
        };

        this.getBounds = function () {
            return this._googleOverlay.getBounds();
        };

        /**
         * Method that converts a google.maps.Polygon
         * into a GeoJSON Linestring object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polygon">google.maps.Polygon</a>
         * documentation for more details.
         * @returns a GeoJSON Polygon object
         */
        this.getGeoJSON = function () {
            //note that bounds / polygon is read-only
            return this.model.get("geometry");
        };

		this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);
    };
    return GroundOverlay;
});