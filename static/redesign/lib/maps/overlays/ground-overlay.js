define(["lib/maps/overlays/polyline"], function (Polyline) {
    "use strict";
    /**
     * Functions to help move from lat/lngs to GeoJSON
     * formats and vice versa
     * @class Polygon
     */
    var GroundOverlay = function (app, opts) {
        Polyline.call(this, app, opts);
        this.editPolygon = null;
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

        this.getPolygonFromBounds = function () {
            var bounds = this.getBounds(),
                path = [],
                ne = bounds.getNorthEast(),
                sw = bounds.getSouthWest();
            path.push(ne);
            path.push(new google.maps.LatLng(sw.lat(), ne.lng()));
            path.push(sw);
            path.push(new google.maps.LatLng(ne.lat(), sw.lng()));
            return path;
        };

        this.redraw = function () {
            if (this.app.mode == 'edit' && this.model.get("active") && this.model.get("geometry")) {
                this.editPolygon = new google.maps.Rectangle({
                    bounds: this.getBounds(),
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 5,
                    fillColor: '#FFF',
                    fillOpacity: 0,
                    map: this.map,
                    draggable: true,
                    geodesic: true,
                    editable: true
                });
                this.attachEventHandlers();
            } else if (this.editPolygon) {
                this.editPolygon.setMap(null);
            }
        };

        this.attachEventHandlers = function () {
            var that = this;
            google.maps.event.addListener(this.editPolygon, 'bounds_changed', function () {
                console.log('bounds_changed', that.editPolygon.getBounds());
                var bounds = that.editPolygon.getBounds();
                that._googleOverlay.setMap(null);
                that.model.set("south", bounds.getSouthWest().lat());
                that.model.get("west", bounds.getSouthWest().lng());
                that.model.set("north", bounds.getNorthEast().lat());
                that.model.set("east", bounds.getNorthEast().lng());
                that.createOverlay(true);
            });
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