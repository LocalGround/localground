define(["jquery"], function ($) {
    "use strict";
    /**
     * Class that controls marker point model overlays.
     * @class Point
     */
    var Polyline = function (app, opts) {

        this._googleOverlay = null;
        this.model = null;
        this.map = null;

        this.getShapeType = function () {
            return "Polyline";
        };

        this.initialize = function (app, opts) {
            this.app = app;
            $.extend(this, opts);
            this.createOverlay(opts.isShowingOnMap || false);
        };

        this.createOverlay = function (isShowingOnMap) {
            this._googleOverlay = new google.maps.Polyline({
                path: this.getGoogleGeometryFromModel(),
                strokeColor: '#' + this.model.get("color"),
                strokeOpacity: 1.0,
                strokeWeight: 5,
                map: isShowingOnMap ? this.map : null
            });
        };

        this.redraw = function () {
            this._googleOverlay.setOptions({
                strokeColor: '#' + this.model.get("color")
            });
        };

        /**
         * An approximation for the center point of a polyline.
         * @param {google.maps.Polyline} googlePolyline
         * @returns {google.maps.LatLng}
         * A latLng corresponding the approximate center of the
         * polyline.
         */
        this.getCenter = function () {
            var coordinates = this._googleOverlay.getPath().getArray();
            return coordinates[Math.floor(coordinates.length / 2)];
        };

        this.centerOn = function () {
            this.map.panTo(this.getCenter());
        };

        this.zoomTo = function () {
            this.map.fitBounds(this.getBounds());
        };

        /**
         * Method that calculates the bounding box of a
         * google.maps.Polyline (in miles)
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @returns {google.maps.LatLngBounds}
         * The bounding box.
         */
        this.getBounds = function () {
            var bounds = new google.maps.LatLngBounds(),
                coords = this._googleOverlay.getPath().getArray(),
                i = 0;
            for (i; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }
            return bounds;
        };

        /**
         * Method that converts a google.maps.Polyline
         * into a GeoJSON Linestring object.
         * @param {google.maps.Polyline} googlePolyline
         * A Google polyline object.
         * @see See the Google <a href="https://developers.google.com/maps/documentation/javascript/reference#Polyline">google.maps.Polyline</a>
         * documentation for more details.
         * @returns a GeoJSON Linestring object
         */
        this.getGeoJSON = function () {
            var pathCoords = this._googleOverlay.getPath().getArray(),
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
        this.getGoogleGeometryFromModel = function () {
            var geoJSON = this.model.get("geometry"),
                path = [],
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
        this.calculateDistance = function () {
            var coords = this._googleOverlay.getPath().getArray(),
                distance = 0,
                i = 1;
            for (i; i < coords.length; i++) {
                distance += google.maps.geometry.spherical.computeDistanceBetween(coords[i - 1], coords[i]);
            }
            return Math.round(distance / 1609.34 * 100) / 100;
        };

        this.makeViewable = function () {
            this._googleOverlay.setOptions({'draggable': false, 'editable': false});
            google.maps.event.clearListeners(this._googleOverlay.getPath());
        };

        this.makeEditable = function (model) {
            var that = this;
            google.maps.event.clearListeners(this._googleOverlay.getPath());
			this._googleOverlay.setOptions({'draggable': false, 'editable': true});
            google.maps.event.addListener(this._googleOverlay.getPath(), 'set_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'remove_at', function () {
                that.saveShape(model);
            });
            google.maps.event.addListener(this._googleOverlay.getPath(), 'insert_at', function () {
                that.saveShape(model);
            });

            google.maps.event.addListener(this._googleOverlay, 'rightclick', function (e) {
                if (e.vertex === undefined) {
                    return;
                }
                if (that._googleOverlay.getPath().getLength() <= 2) {
                    return;
                }
                that.app.vent.trigger('show-delete-menu', {
                    googleOverlay: that._googleOverlay,
                    point: e.vertex
                });
            });
        };

        this.restoreModelGeometry = function () {
            this._googleOverlay.setPath(this.getGoogleLatLngFromModel());
        };

        this.saveShape = function (model) {
            model.set("geometry", this.getGeoJSON());
            model.save();
        };

        this.intersects = function (latLng) {
            //alert("No yet implemented.");
            return false;
        };

        this.initialize(app, opts);

    };
    return Polyline;
});
