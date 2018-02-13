define(["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var Polygon = function (app, opts) {
        // Polygon inherits most of its functionality, 
        // including event handling, from Polyline
        Polyline.call(this, app, opts);

        // See this.deleteVertex() inherited from Polyline. 
        // A Polygon cannot have fewer than 3 vertices
        this.minimumVertices = 3

        this.getShapeType = function () {
            return "Polygon";
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polygon({
                path: this.getGoogleLatLngFromModel(),
                //strokeColor: '#' + this.model.get("fillColor"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                //fillColor: '#' + this.model.get("fillColor"),
                fillOpacity: 0.35,
                map: isShowingOnMap ? this.map : null,
                draggable: true,
                editable: true,
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#0000FF',
                fillOpacity: 0.35,
            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                // strokeColor: '#' + this.model.get("strokeColor"),
                // fillColor: '#' + this.model.get("fillColor")
                strokeColor: this.model.collection.fillColor,
                fillColor: this.model.collection.fillColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                draggable: this.model.get("active")? true : false,
                editable: this.model.get("active")? true : false
            });

            if (this.model.get("active")) {
                this.addEvents();
            }
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